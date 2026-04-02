<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
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
        <h1 class="ape-title">Reset Password</h1>
        <p class="ape-subtitle">Enter your email to receive a reset link</p>
    <#elseif section = "form">
        <form id="kc-reset-password-form" action="${url.loginAction}" method="post" class="ape-form">
            <div class="ape-form-group">
                <label for="username" class="ape-label">
                    <#if !realm.loginWithEmailAllowed>
                        Username
                    <#elseif !realm.registrationEmailAsUsername>
                        Email or Username
                    <#else>
                        Email Address
                    </#if>
                </label>
                <input type="text" id="username" name="username" class="ape-input"
                       placeholder="Enter your email"
                       autofocus
                       value="${(auth.attemptedUsername!'')}" />
                <#if messagesPerField.existsError('username')>
                    <span class="ape-field-error">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                </#if>
            </div>
            
            <button type="submit" class="ape-btn">
                <span>Send Reset Link</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
            </button>
        </form>
        
        <div class="ape-register-box">
            <p><a href="${url.loginUrl}">← Back to Sign In</a></p>
        </div>
        
        <div class="ape-footer">
            <div class="ape-footer-links">
                <a href="#">Help</a><span>•</span>
                <a href="#">Terms</a><span>•</span>
                <a href="#">Privacy</a>
            </div>
            <p class="ape-copyright">© 2025 Ape Iskole</p>
        </div>
    <#elseif section = "info">
        <div class="ape-info-box">
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>
    </#if>

    <style>
        /* =========================================
           APE ISKOLE PASSWORD RESET THEME
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

        .ape-form-group {
            margin-bottom: 1.25rem;
        }

        .ape-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text);
            margin-bottom: 0.5rem;
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

        .ape-field-error {
            display: block;
            font-size: 0.75rem;
            color: var(--color-danger);
            margin-top: 0.25rem;
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

        .ape-info-box {
            background-color: #eff6ff;
            border-radius: 14px;
            padding: 0.75rem 1rem;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            color: var(--color-primary);
            border-left: 4px solid var(--color-primary);
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