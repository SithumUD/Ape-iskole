<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
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
                <h1 class="edu-welcome-title">Reset Password</h1>
                <p class="edu-welcome-subtitle">Enter your email to receive a reset link</p>
            </div>
        </div>
    <#elseif section = "form">
        <form id="kc-reset-password-form" action="${url.loginAction}" method="post" class="edu-form">
            <div class="edu-form-group">
                <label for="username" class="edu-label">
                    <#if !realm.loginWithEmailAllowed>
                        Username
                    <#elseif !realm.registrationEmailAsUsername>
                        Email or Username
                    <#else>
                        Email Address
                    </#if>
                </label>
                <input type="text" id="username" name="username" class="edu-input"
                       placeholder="Enter your email"
                       autofocus
                       value="${(auth.attemptedUsername!'')}" />
                <#if messagesPerField.existsError('username')>
                    <span class="edu-field-error">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                </#if>
            </div>
            
            <button type="submit" class="edu-btn edu-btn-primary">
                <span>Send Reset Link</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
            </button>
        </form>
        
        <div class="edu-register-link">
            <p><a href="${url.loginUrl}">← Back to Sign In</a></p>
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
    <#elseif section = "info">
        <div class="edu-info-box">
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>
    </#if>
</@layout.registrationLayout>
