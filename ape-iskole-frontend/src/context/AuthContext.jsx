import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import keycloak from "../utils/KeycloakConfig";
import ApiUser from "../services/ApiUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const syncAttempted = useRef(false);
  const isInitialized = useRef(false);

  const syncUserWithBackend = useCallback(async (tokenParsed) => {
    if (syncAttempted.current) return;
    try {
      // Helper to pick the best role from Keycloak roles
      const getBestRole = (roles) => {
        if (!roles) return "public_user";
        // Order of precedence
        if (roles.includes("super_admin")) return "super_admin";
        if (roles.includes("school_admin")) return "school_admin";
        if (roles.includes("moderator")) return "moderator";
        if (roles.includes("public_user") || roles.includes("public-user")) return "public_user";
        return "public_user";
      };

      const roles = tokenParsed.realm_access?.roles || tokenParsed.role || [];
      const bestRole = getBestRole(roles);

      const syncData = {
        keycloakId: tokenParsed.sub,
        email: tokenParsed.email,
        fullName: tokenParsed.name || `${tokenParsed.given_name || ""} ${tokenParsed.family_name || ""}`.trim(),
        role: bestRole,
        isStudent: tokenParsed.is_student === "true" || !!tokenParsed.is_student
      };
      
      await ApiUser.syncUser(syncData);
      // Always fetch fresh profile from /me so DB-assigned fields like schoolId are included
      const meResponse = await ApiUser.getCurrentUser();
      const profile = meResponse.data;
      setUserProfile(profile);
      syncAttempted.current = true;

      // 🚀 AUTO-REDIRECT FOR ADMINS:
      // If the user just logged in and is on a root/public page, send them to their dashboard
      const isAdminRole = profile.role === "super_admin" || profile.role === "school_admin";
      const isPublicPath = window.location.pathname === "/" || window.location.pathname === "/login";

      if (isAdminRole && isPublicPath) {
        const targetPath = profile.role === "super_admin" ? "/super-admin/dashboard" : "/school-admin/dashboard";
        window.location.href = targetPath;
      }
    } catch (error) {
      console.error("Failed to sync user with backend:", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initKeycloak = async () => {
      try {
        const auth = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
        });

        setAuthenticated(auth);
        
        if (auth && keycloak.token) {
          localStorage.setItem('token', keycloak.token);
          // Sync with backend immediately on successful auth
          await syncUserWithBackend(keycloak.tokenParsed);
        }
      } catch (error) {
        console.error("Keycloak initialization failed:", error);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    initKeycloak();

    const tokenRefreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(70).then((refreshed) => {
          if (refreshed) {
            localStorage.setItem('token', keycloak.token);
          }
        }).catch(() => {
          console.error("Failed to refresh token");
          keycloak.logout();
        });
      }
    }, 60000);

    return () => clearInterval(tokenRefreshInterval);
  }, [syncUserWithBackend]);

  const login = () => keycloak.login();
  const logout = () => {
    localStorage.removeItem('token');
    keycloak.logout({ redirectUri: window.location.origin });
  };
  const register = () => keycloak.register();

  // SECURE ROLE CHECKING: Cross-checks Keycloak AND Database Profile
  const hasRole = useCallback((role) => {
    if (!authenticated) return false;
    
    // Check Keycloak roles
    const hasKeycloakRole = keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role);
    
    // Check Database roles (from synchronized profile)
    const hasDatabaseRole = userProfile?.role === role;
    
    return hasKeycloakRole || hasDatabaseRole;
  }, [authenticated, userProfile]);

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        initialized,
        authenticated,
        userProfile,
        loading,
        login,
        logout,
        register,
        hasRole,
        isSuperAdmin: () => hasRole("super_admin"),
        isSchoolAdmin: () => hasRole("school_admin"),
        isModerator: () => hasRole("moderator"),
        isPublicUser: () => hasRole("public_user"),
        token: keycloak.token,
        userInfo: keycloak.tokenParsed || null,
      }}
    >
      {initialized ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
