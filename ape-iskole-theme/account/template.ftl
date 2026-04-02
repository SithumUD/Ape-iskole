<#macro mainLayout active bodyClass>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${msg("accountManagementTitle")}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #2563eb;
            --color-secondary: #22c55e;
        }
        
        body {
            font-family: 'Inter', -apple-system, system-ui, sans-serif !important;
            background-color: #f8fafc !important;
            color: #1e293b;
        }

        .ape-navbar {
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.75rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .ape-brand {
            font-size: 1.25rem;
            font-weight: 800;
            color: #0f172a;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .ape-brand-icon {
            width: 32px;
            height: 32px;
            background-color: var(--color-primary);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1rem;
        }

        .ape-brand-accent {
            color: var(--color-primary);
        }

        .ape-nav-links {
            display: flex;
            gap: 1.5rem;
        }

        .ape-nav-link {
            text-decoration: none;
            color: #64748b;
            font-size: 0.875rem;
            font-weight: 600;
            padding: 0.5rem 0.75rem;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .ape-nav-link:hover, .ape-nav-link.active {
            color: var(--color-primary);
            background-color: #eff6ff;
        }

        .ape-container {
            max-width: 1024px;
            margin: 2.5rem auto;
            padding: 0 1.5rem;
        }

        .ape-card {
            background: #ffffff;
            border-radius: 1.5rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .ape-card-header {
            padding: 2rem 2.5rem;
            border-bottom: 1px solid #f1f5f9;
            background-color: #fafafa;
        }

        .ape-card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
        }

        .ape-card-body {
            padding: 2.5rem;
        }

        .ape-form-group {
            margin-bottom: 1.5rem;
        }

        .ape-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 0.5rem;
        }

        .ape-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            border: 1px solid #cbd5e1;
            font-size: 1rem;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        .ape-input:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .ape-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 0.875rem;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }

        .ape-btn-primary {
            background-color: var(--color-primary);
            color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }

        .ape-btn-primary:hover {
            background-color: #1d4ed8;
            transform: translateY(-1px);
        }

        .ape-alert {
            padding: 1rem 1.25rem;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .ape-alert-success {
            background-color: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .ape-alert-error {
            background-color: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
    </style>
</head>
<body class="admin-console user ${bodyClass}">
    <header class="ape-navbar">
        <a href="${url.referrerUrl!url.accountUrl}" class="ape-brand">
            <div class="ape-brand-icon">A</div>
            <span>APE <span class="ape-brand-accent">ISKOLE</span></span>
        </a>
        
        <nav class="ape-nav-links">
            <a href="${url.accountUrl}" class="ape-nav-link <#if active=='account'>active</#if>">${msg("account")}</a>
            <#if features.passwordUpdateSupported><a href="${url.passwordUrl}" class="ape-nav-link <#if active=='password'>active</#if>">${msg("password")}</a></#if>
            <a href="${url.totpUrl}" class="ape-nav-link <#if active=='totp'>active</#if>">${msg("authenticator")}</a>
            <#if features.identityFederation><a href="${url.socialUrl}" class="ape-nav-link <#if active=='social'>active</#if>">${msg("federatedIdentity")}</a></#if>
            <a href="${url.sessionsUrl}" class="ape-nav-link <#if active=='sessions'>active</#if>">${msg("sessions")}</a>
            <a href="${url.applicationsUrl}" class="ape-nav-link <#if active=='applications'>active</#if>">${msg("applications")}</a>
            <#if features.log><a href="${url.logUrl}" class="ape-nav-link <#if active=='log'>active</#if>">${msg("log")}</a></#if>
        </nav>

        <div>
           <a href="${url.logoutUrl}" class="ape-nav-link" style="color: #ef4444">${msg("doSignOut")}</a>
        </div>
    </header>

    <main class="ape-container">
        <#if message?has_content>
            <div class="ape-alert ape-alert-${message.type}">
                <#if message.type=='success'><span>✅</span></#if>
                <#if message.type=='error'><span>⚠️</span></#if>
                ${message.summary}
            </div>
        </#if>

        <#nested>
    </main>

    <footer style="text-align: center; padding: 3rem 0; color: #94a3b8; font-size: 0.875rem;">
        &copy; ${.now?string('yyyy')} Ape Iskole. All rights reserved.
    </footer>
</body>
</html>
</#macro>
