<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !(registrationDisabled!false); section>
    <#if section = "header">
        <div class="edu-logo-row">
            <div class="edu-logo-box" style="background: #2563eb;">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <path d="M16 3L3 9.5L16 16L29 9.5L16 3Z" fill="white" opacity="0.9"/>
                    <path d="M3 22.5L16 29L29 22.5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M3 16L16 22.5L29 16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="edu-brand-text">
                <div class="edu-brand-name">Ape <span>Iskole</span></div>
                <div class="edu-brand-tag">Educational Platform</div>
            </div>
        </div>
        <h1 class="edu-title">Welcome Back</h1>
        <p class="edu-subtitle">Sign in to continue your learning journey</p>
    <#elseif section = "form">
        <form id="kc-form-login" action="${url.loginAction}" method="post" class="edu-form">
            <#if messagesPerField.existsError('username','password')>
                <div class="edu-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                </div>
            </#if>
            
            <div class="edu-field">
                <label class="edu-label" for="username">
                    <#if !realm.loginWithEmailAllowed>Username
                    <#elseif !realm.registrationEmailAsUsername>Email or Username
                    <#else>Email Address</#if>
                </label>
                <input type="text" id="username" name="username" class="edu-input"
                       placeholder="<#if !realm.loginWithEmailAllowed>Enter your username<#elseif !realm.registrationEmailAsUsername>Enter email or username<#else>Enter your email</#if>"
                       autocomplete="username" autofocus value="${(login.username!'')}"/>
            </div>
            
            <div class="edu-field">
                <div class="edu-label-row">
                    <label class="edu-label" for="password">Password</label>
                    <#if realm.resetPasswordAllowed>
                        <a href="${url.loginResetCredentialsUrl}" class="edu-link">Forgot password?</a>
                    </#if>
                </div>
                <div class="edu-password-wrap">
                    <input type="password" id="password" name="password" class="edu-input"
                           placeholder="Enter your password" autocomplete="current-password"/>
                    <button type="button" class="edu-eye-btn" onclick="var p=document.getElementById('password');p.type=p.type==='password'?'text':'password';">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <#if realm.rememberMe && !(usernameHidden!false)>
                <div class="edu-checkbox-row">
                    <input type="checkbox" id="rememberMe" name="rememberMe" <#if login.rememberMe??>checked</#if>/>
                    <label for="rememberMe">Remember me</label>
                </div>
            </#if>
            
            <button type="submit" class="edu-btn">
                <span>Sign In</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
            
            <#if realm.password && social.providers?? && social.providers?size gt 0>
                <div class="edu-divider"><span>or</span></div>
                <div class="edu-social-row">
                    <#list social.providers as p>
                        <a href="${p.loginUrl}" class="edu-social-btn" title="${p.displayName}">
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
            <div class="edu-register-box">
                Don't have an account? <a href="${url.registrationUrl}">Create one</a>
            </div>
        </#if>
        
        <div class="edu-footer">
            <div class="edu-footer-links">
                <a href="#">Help</a><span>•</span>
                <a href="#">Terms</a><span>•</span>
                <a href="#">Privacy</a>
            </div>
            <p class="edu-copyright">© 2025 Ape Iskole</p>
        </div>
    </#if>
</@layout.registrationLayout>
