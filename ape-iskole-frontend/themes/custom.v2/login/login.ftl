<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        <div class="kc-header-wrapper">
            <div class="kc-logo-text">
                
                <h1>EDUTrack-Pro</h1>
                <p class="kc-subtitle">School Management System</p>
            </div>
        </div>
    <#elseif section = "form">
        <div id="kc-form">
            <div id="kc-form-wrapper">
                <#if realm.password>
                    <form id="kc-form-login" class="${properties.kcFormClass!} custom-form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                        
                        <#if !usernameHidden??>
                            <div class="form-group ${messagesPerField.existsError('username','password')?then('error', '')}">
                                <div class="input-wrapper">
                                    <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 7.5C5 5.29086 6.79086 3.5 9 3.5C11.2091 3.5 13 5.29086 13 7.5C13 9.70914 11.2091 11.5 9 11.5C6.79086 11.5 5 9.70914 5 7.5Z" stroke="#6B7280" stroke-width="1.5"/>
                                        <path d="M2.5 16.5C2.5 14.2909 4.29086 12.5 6.5 12.5H11.5C13.7091 12.5 15.5 14.2909 15.5 16.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M15 7.5C15 6.39543 15.8954 5.5 17 5.5C18.1046 5.5 19 6.39543 19 7.5C19 8.60457 18.1046 9.5 17 9.5C15.8954 9.5 15 8.60457 15 7.5Z" stroke="#6B7280" stroke-width="1.5"/>
                                        <path d="M15 16.5C15 15.3954 15.8954 14.5 17 14.5C18.1046 14.5 19 15.3954 19 16.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    <input tabindex="1" 
                                           id="username" 
                                           class="form-input"
                                           placeholder="Registration / Admission Number"
                                           name="username" 
                                           value="${(login.username!'')}" 
                                           type="text" 
                                           autofocus 
                                           autocomplete="off"
                                           aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                                    />
                                </div>
                                <p class="input-help-text">Enter your student or staff registration number</p>
                            </div>
                        </#if>

                        <div class="form-group ${messagesPerField.existsError('username','password')?then('error', '')}">
                            <div class="input-wrapper">
                                <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 8.33333V7.5C5 5.29086 6.79086 3.5 9 3.5C11.2091 3.5 13 5.29086 13 7.5V8.33333" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 12.1667V13.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <rect x="3.5" y="8.33333" width="11" height="8.33333" rx="2" stroke="#6B7280" stroke-width="1.5"/>
                                </svg>
                                <input tabindex="2" 
                                       id="password" 
                                       class="form-input"
                                       placeholder="Password" 
                                       name="password" 
                                       type="password" 
                                       autocomplete="off"
                                       aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                                />
                                <button type="button" class="password-toggle" data-password-toggle aria-label="${msg('showPassword')}">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.66797 10C1.66797 10 4.16797 4.16666 10.0013 4.16666C15.8346 4.16666 18.3346 10 18.3346 10C18.3346 10 15.8346 15.8333 10.0013 15.8333C4.16797 15.8333 1.66797 10 1.66797 10Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                            <p class="input-help-text">Use your assigned password</p>
                        </div>

                        <#if messagesPerField.existsError('username','password')>
                            <div class="error-message">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5.33334V8M8 10.6667H8.00667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                            </div>
                        </#if>

                        <div class="form-options">
                            <#if realm.rememberMe && !usernameHidden??>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if>>
                                        <span class="checkmark"></span>
                                        <span class="checkbox-text">${msg("rememberMe")}</span>
                                    </label>
                                </div>
                            </#if>
                            
                            <#if realm.resetPasswordAllowed>
                                <a tabindex="5" href="${url.loginResetCredentialsUrl}" class="forgot-password">
                                    ${msg("doForgotPassword")}
                                </a>
                            </#if>
                        </div>

                        <div class="form-actions">
                            <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                            <button tabindex="4" class="submit-button" name="login" id="kc-login" type="submit">
                                <svg class="submit-button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.33333 10H16.6667M16.6667 10L12.5 5.83333M16.6667 10L12.5 14.1667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Sign In to EDUTrack-Pro
                            </button>
                        </div>

                        <div class="system-info">
                            <div class="system-info-item">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 10.6667V8" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 5.33334H8.00667" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>Student Registration Number Format: STD-XXXX</span>
                            </div>
                            <div class="system-info-item">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 10.6667V8" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 5.33334H8.00667" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>Staff Registration Number Format: STAFF-XXXX</span>
                            </div>
                        </div>

                        <#if social.providers??>
                            <div class="social-divider">
                                <span>Or continue with</span>
                            </div>

                            <div class="social-providers">
                                <#list social.providers as p>
                                    <a href="${p.loginUrl}" class="social-provider ${p.alias}">
                                        <#if p.iconClasses?has_content>
                                            <span class="provider-icon">
                                                <#switch p.alias>
                                                    <#case "google">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                                                            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.72 16.7 5.85 14.1H2.18V16.94C4.01 20.53 7.61 23 12 23Z" fill="#34A853"/>
                                                            <path d="M5.85 14.09C5.63 13.43 5.5 12.73 5.5 12C5.5 11.27 5.63 10.57 5.85 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.85 14.09Z" fill="#FBBC05"/>
                                                            <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.61 1 4.01 3.47 2.18 7.07L5.85 9.91C6.72 7.31 9.14 5.38 12 5.38Z" fill="#EA4335"/>
                                                        </svg>
                                                        <#break>
                                                    <#default>
                                                        <span>${p.displayName!}</span>
                                                </#switch>
                                            </span>
                                        <#else>
                                            <span>${p.displayName!}</span>
                                        </#if>
                                    </a>
                                </#list>
                            </div>
                        </#if>
                    </form>
                </#if>
            </div>
        </div>
    <#elseif section = "info">
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div class="registration-container">
                <p>Don't have an account? <a tabindex="6" href="${url.registrationUrl}" class="register-link">Contact Administrator</a></p>
                <p class="support-text">For account creation and registration issues, contact your institution's administrator.</p>
            </div>
        </#if>
    </#if>
</@layout.registrationLayout>