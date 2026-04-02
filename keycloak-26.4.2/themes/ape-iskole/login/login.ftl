<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !(registrationDisabled!false); section>
    <#if section = "header">
        <div class="ape-logo-row">
            <div class="ape-logo-box">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 3L3 9.5L16 16L29 9.5L16 3Z" fill="white" opacity="0.9"/>
                    <path d="M3 22.5L16 29L29 22.5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M3 16L16 22.5L29 16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="ape-brand-text">
                <div class="ape-brand-name">Ape Iskole</div>
                <div class="ape-brand-tag">Sri Lanka's School Network</div>
            </div>
        </div>
        <h1 class="ape-title">Welcome Back</h1>
        <p class="ape-subtitle">Sign in to continue your learning journey</p>
    <#elseif section = "form">
        <form id="kc-form-login" action="${url.loginAction}" method="post" class="ape-form">
            <#if messagesPerField.existsError('username','password')>
                <div class="ape-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                </div>
            </#if>
            
            <div class="ape-field">
                <label class="ape-label" for="username">
                    <#if !realm.loginWithEmailAllowed>Username
                    <#elseif !realm.registrationEmailAsUsername>Email or Username
                    <#else>Email Address</#if>
                </label>
                <input type="text" id="username" name="username" class="ape-input"
                       placeholder="<#if !realm.loginWithEmailAllowed>Enter your username<#elseif !realm.registrationEmailAsUsername>Enter email or username<#else>Enter your email</#if>"
                       autocomplete="username" autofocus value="${(login.username!'')}"/>
            </div>
            
            <div class="ape-field">
                <div class="ape-label-row">
                    <label class="ape-label" for="password">Password</label>
                    <#if realm.resetPasswordAllowed>
                        <a href="${url.loginResetCredentialsUrl}" class="ape-link">Forgot password?</a>
                    </#if>
                </div>
                <div class="ape-password-wrap">
                    <input type="password" id="password" name="password" class="ape-input"
                           placeholder="Enter your password" autocomplete="current-password"/>
                    <button type="button" class="ape-eye-btn" onclick="var p=document.getElementById('password');p.type=p.type==='password'?'text':'password';">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <#if realm.rememberMe && !(usernameHidden!false)>
                <div class="ape-checkbox-row">
                    <input type="checkbox" id="rememberMe" name="rememberMe" <#if login.rememberMe??>checked</#if>/>
                    <label for="rememberMe">Remember me</label>
                </div>
            </#if>
            
            <button type="submit" class="ape-btn">
                <span>Sign In</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
            
            <#if realm.password && social.providers?? && social.providers?size gt 0>
                <div class="ape-divider"><span>or</span></div>
                <div class="ape-social-row">
                    <#list social.providers as p>
                        <a href="${p.loginUrl}" class="ape-social-btn" title="${p.displayName}">
                            <#if p.alias == "google">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            <#elseif p.alias == "github">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            <#elseif p.alias == "microsoft" || p.alias == "microsoft-entra-id">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                                </svg>
                            <#else>
                                ${p.displayName}
                            </#if>
                        </a>
                    </#list>
                </div>
            </#if>
        </form>
        
        <#if realm.password && realm.registrationAllowed && !(registrationDisabled!false)>
            <div class="ape-register-box">
                Don't have an account? <a href="${url.registrationUrl}">Create one</a>
            </div>
        </#if>
        
        <div class="ape-footer">
            <div class="ape-footer-links">
                <a href="#">Help</a><span>•</span>
                <a href="#">Terms</a><span>•</span>
                <a href="#">Privacy</a>
            </div>
            <p class="ape-copyright">© 2025 Ape Iskole</p>
        </div>
    </#if>

    <style>
        /* =========================================
           APE ISKOLE LOGIN THEME
           Matches Tailwind theme from React app
        ========================================= */
        :root {
            --color-primary: #2563eb;
            --color-primary-hover: #1d4ed8;
            --color-secondary: #22c55e;
            --color-secondary-hover: #16a34a;
            --color-accent-orange: #f97316;
            --color-accent-yellow: #facc15;
            --color-accent-purple: #7c3aed;
            --color-accent-cyan: #06b6d4;
            --color-bg: #f5f7fa;
            --color-bg-soft: #eef4ff;
            --color-surface: #ffffff;
            --color-surface-muted: #f8fafc;
            --color-border: #e5e7eb;
            --color-text: #1f2937;
            --color-text-muted: #6b7280;
            --color-text-soft: #94a3b8;
            --color-heading: #111827;
            --color-success: #16a34a;
            --color-warning: #f59e0b;
            --color-danger: #ef4444;
            --color-info: #0ea5e9;
            --gradient-primary: linear-gradient(135deg, #2563eb, #22c55e);
            --gradient-secondary: linear-gradient(135deg, #f97316, #facc15);
            --gradient-premium: linear-gradient(135deg, #7c3aed, #2563eb);
            --gradient-hero: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 45%, #fff7ed 100%);
            --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.05);
            --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
            --shadow-lg: 0 14px 40px rgba(15, 23, 42, 0.12);
            --radius-sm: 10px;
            --radius-md: 16px;
            --radius-lg: 24px;
            --font-heading: "Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --font-body: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Base */
        body {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #312e81 100%);
            font-family: var(--font-body);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .kc-main {
            background: transparent !important;
            width: 100%;
            max-width: 480px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .card-pf {
            background: var(--color-surface);
            border-radius: 28px;
            box-shadow: var(--shadow-lg);
            padding: 2rem;
            border: none;
        }

        /* Logo & brand */
        .ape-logo-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .ape-logo-box {
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            width: 48px;
            height: 48px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-md);
        }

        .ape-brand-name {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--color-heading);
            letter-spacing: -0.025em;
            font-family: var(--font-heading);
        }

        .ape-brand-tag {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-text-muted);
        }

        .ape-title {
            font-size: 1.875rem;
            font-weight: 800;
            color: var(--color-heading);
            margin-bottom: 0.5rem;
            font-family: var(--font-heading);
        }

        .ape-subtitle {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin-bottom: 1.75rem;
        }

        /* Form */
        .ape-form {
            margin-top: 1rem;
        }

        .ape-field {
            margin-bottom: 1.25rem;
        }

        .ape-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text);
            margin-bottom: 0.5rem;
        }

        .ape-label-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }

        .ape-input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 14px;
            background-color: var(--color-surface-muted);
            transition: all 0.2s ease;
            outline: none;
            font-family: var(--font-body);
        }

        .ape-input:focus {
            border-color: #93c5fd;
            background-color: white;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .ape-password-wrap {
            position: relative;
        }

        .ape-eye-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-text-soft);
        }

        .ape-checkbox-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .ape-checkbox-row input {
            width: 1rem;
            height: 1rem;
            accent-color: var(--color-primary);
        }

        .ape-checkbox-row label {
            font-size: 0.875rem;
            color: var(--color-text);
        }

        .ape-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            color: white;
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 14px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: var(--shadow-md);
        }

        .ape-btn:hover {
            transform: scale(1.02);
            box-shadow: var(--shadow-lg);
        }

        .ape-link {
            font-size: 0.75rem;
            color: var(--color-primary);
            text-decoration: none;
            font-weight: 500;
        }

        .ape-link:hover {
            text-decoration: underline;
        }

        .ape-alert {
            background-color: #fee2e2;
            border-left: 4px solid var(--color-danger);
            padding: 0.75rem 1rem;
            border-radius: 14px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            color: #b91c1c;
        }

        .ape-divider {
            margin: 1.5rem 0;
            text-align: center;
            position: relative;
        }

        .ape-divider span {
            background: white;
            padding: 0 0.75rem;
            color: var(--color-text-soft);
            font-size: 0.75rem;
            font-weight: 500;
        }

        .ape-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: var(--color-border);
            z-index: -1;
        }

        .ape-social-row {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .ape-social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 12px;
            border: 1px solid var(--color-border);
            background: white;
            transition: all 0.2s;
        }

        .ape-social-btn:hover {
            border-color: var(--color-primary);
            transform: translateY(-2px);
        }

        .ape-register-box {
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--color-border);
            font-size: 0.875rem;
            color: var(--color-text);
        }

        .ape-register-box a {
            color: var(--color-primary);
            font-weight: 600;
            text-decoration: none;
        }

        .ape-register-box a:hover {
            text-decoration: underline;
        }

        .ape-footer {
            margin-top: 2rem;
            text-align: center;
            font-size: 0.75rem;
            color: var(--color-text-soft);
        }

        .ape-footer-links {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .ape-footer-links a {
            color: var(--color-text-soft);
            text-decoration: none;
        }

        .ape-footer-links a:hover {
            color: var(--color-primary);
        }

        .ape-copyright {
            margin: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
            .card-pf {
                padding: 1.5rem;
            }
            .ape-title {
                font-size: 1.5rem;
            }
        }
    </style>
</@layout.registrationLayout>