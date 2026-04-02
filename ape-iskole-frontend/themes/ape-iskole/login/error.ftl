<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <div class="edu-header">
            <div class="edu-logo-wrapper">
                <div class="edu-logo-icon edu-logo-error">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="16" cy="16" r="12"/>
                        <line x1="16" y1="10" x2="16" y2="16"/>
                        <line x1="16" y1="20" x2="16.01" y2="20"/>
                    </svg>
                </div>
                <div class="edu-brand">
                    <span class="edu-brand-name">EDUTrack-<span class="edu-brand-accent">Pro</span></span>
                    <span class="edu-brand-tagline">Learning Portal</span>
                </div>
            </div>
            <div class="edu-welcome">
                <h1 class="edu-welcome-title edu-error-title">Something Went Wrong</h1>
                <p class="edu-welcome-subtitle">An unexpected error occurred</p>
            </div>
        </div>
    <#elseif section = "form">
        <div class="edu-error-content">
            <div class="edu-alert edu-alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>${kcSanitize(message.summary)?no_esc}</span>
            </div>
            
            <#if client?? && client.baseUrl?has_content>
                <a href="${client.baseUrl}" class="edu-btn edu-btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>Back to Application</span>
                </a>
            </#if>
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
