<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('firstName','lastName','email','username','password','password-confirm'); section>
    <#if section = "header">
        <div class="edu-header">
            <div class="edu-logo-wrapper">
                <div class="edu-logo-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 3L3 9.5L16 16L29 9.5L16 3Z" fill="currentColor" opacity="0.9"/>
                        <path d="M3 22.5L16 29L29 22.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 16L16 22.5L29 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="26" cy="16" r="2.5" fill="#f97316"/>
                    </svg>
                </div>
                <div class="edu-brand">
                    <span class="edu-brand-name">EDUTrack-<span class="edu-brand-accent">Pro</span></span>
                    <span class="edu-brand-tagline">Learning Portal</span>
                </div>
            </div>
            <div class="edu-welcome">
                <h1 class="edu-welcome-title">Create Account</h1>
                <p class="edu-welcome-subtitle">Join thousands of learners today</p>
            </div>
        </div>
    <#elseif section = "form">
        <form id="kc-register-form" action="${url.registrationAction}" method="post" class="edu-form">
            <div class="edu-form-row">
                <div class="edu-form-group">
                    <label for="firstName" class="edu-label">First Name</label>
                    <input type="text" id="firstName" name="firstName" class="edu-input"
                           placeholder="First name"
                           value="${(register.formData.firstName!'')}" />
                    <#if messagesPerField.existsError('firstName')>
                        <span class="edu-field-error">${kcSanitize(messagesPerField.get('firstName'))?no_esc}</span>
                    </#if>
                </div>
                
                <div class="edu-form-group">
                    <label for="lastName" class="edu-label">Last Name</label>
                    <input type="text" id="lastName" name="lastName" class="edu-input"
                           placeholder="Last name"
                           value="${(register.formData.lastName!'')}" />
                    <#if messagesPerField.existsError('lastName')>
                        <span class="edu-field-error">${kcSanitize(messagesPerField.get('lastName'))?no_esc}</span>
                    </#if>
                </div>
            </div>
            
            <div class="edu-form-group">
                <label for="email" class="edu-label">Email Address</label>
                <input type="email" id="email" name="email" class="edu-input"
                       placeholder="Enter your email"
                       value="${(register.formData.email!'')}" />
                <#if messagesPerField.existsError('email')>
                    <span class="edu-field-error">${kcSanitize(messagesPerField.get('email'))?no_esc}</span>
                </#if>
            </div>
            
            <#if !realm.registrationEmailAsUsername>
                <div class="edu-form-group">
                    <label for="username" class="edu-label">Username</label>
                    <input type="text" id="username" name="username" class="edu-input"
                           placeholder="Choose a username"
                           value="${(register.formData.username!'')}" />
                    <#if messagesPerField.existsError('username')>
                        <span class="edu-field-error">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                    </#if>
                </div>
            </#if>
            
            <#if passwordRequired??>
                <div class="edu-form-group">
                    <label for="password" class="edu-label">Password</label>
                    <input type="password" id="password" name="password" class="edu-input"
                           placeholder="Create a password" autocomplete="new-password" />
                    <#if messagesPerField.existsError('password')>
                        <span class="edu-field-error">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
                    </#if>
                </div>
                
                <div class="edu-form-group">
                    <label for="password-confirm" class="edu-label">Confirm Password</label>
                    <input type="password" id="password-confirm" name="password-confirm" class="edu-input"
                           placeholder="Confirm your password" autocomplete="new-password" />
                    <#if messagesPerField.existsError('password-confirm')>
                        <span class="edu-field-error">${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}</span>
                    </#if>
                </div>
            </#if>
            
            <#if recaptchaRequired??>
                <div class="edu-recaptcha">
                    <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                </div>
            </#if>
            
            <button type="submit" class="edu-btn edu-btn-primary">
                <span>Create Account</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
            </button>
        </form>
        
        <div class="edu-register-link">
            <p>Already have an account? <a href="${url.loginUrl}">Sign in</a></p>
        </div>
        
        <div class="edu-footer">
            <div class="edu-footer-links">
                <a href="#">Help</a>
                <span>•</span>
                <a href="#">Terms</a>
                <span>•</span>
                <a href="#">Privacy</a>
            </div>
            <p class="edu-copyright">© 2025 EDUTrack-Pro. All rights reserved.</p>
        </div>
    </#if>
</@layout.registrationLayout>
