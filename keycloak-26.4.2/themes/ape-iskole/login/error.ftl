<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <div class="ape-logo-row">
            <div class="ape-logo-box ape-logo-error">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" stroke-width="2">
                    <circle cx="16" cy="16" r="12"/>
                    <line x1="16" y1="10" x2="16" y2="16"/>
                    <line x1="16" y1="20" x2="16.01" y2="20"/>
                </svg>
            </div>
            <div class="ape-brand-text">
                <div class="ape-brand-name">Ape Iskole</div>
                <div class="ape-brand-tag">Sri Lanka's School Network</div>
            </div>
        </div>
        <h1 class="ape-title ape-error-title">Something Went Wrong</h1>
        <p class="ape-subtitle">An unexpected error occurred</p>
    <#elseif section = "form">
        <div class="ape-error-content">
            <div class="ape-alert ape-alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>${kcSanitize(message.summary)?no_esc}</span>
            </div>
            
            <#if client?? && client.baseUrl?has_content>
                <a href="${client.baseUrl}" class="ape-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>Back to Application</span>
                </a>
            </#if>
        </div>
        
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
           APE ISKOLE ERROR THEME
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

        .ape-logo-error {
            background: linear-gradient(135deg, var(--color-danger), #b91c1c);
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

        .ape-error-title {
            color: var(--color-danger);
        }

        .ape-subtitle {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin-bottom: 1.75rem;
        }

        /* Error content */
        .ape-error-content {
            margin-top: 1rem;
        }

        .ape-alert {
            padding: 0.75rem 1rem;
            border-radius: 14px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
        }

        .ape-alert-error {
            background-color: #fee2e2;
            border-left: 4px solid var(--color-danger);
            color: #b91c1c;
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
            text-decoration: none;
        }

        .ape-btn:hover {
            transform: scale(1.02);
            box-shadow: var(--shadow-lg);
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