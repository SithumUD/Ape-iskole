<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <title>EDUTrack-Pro | ${msg("loginTitle",(realm.displayName!''))}</title>
    <style type="text/css">
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #ecfeff 100%) !important;
            min-height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            color: #1f2937 !important;
        }
        
        .edu-wrapper {
            width: 100%;
            max-width: 440px;
        }
        
        .edu-card {
            background: #ffffff !important;
            border-radius: 24px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
            padding: 40px !important;
            position: relative;
            overflow: hidden;
        }
        
        .edu-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #0d9488, #14b8a6, #f97316);
        }
        
        .edu-header {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .edu-logo-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
        }
        
        .edu-logo-box {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #0d9488, #0f766e);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35);
        }
        
        .edu-brand-text {
            text-align: left;
        }
        
        .edu-brand-name {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
        }
        
        .edu-brand-name span {
            color: #0d9488;
        }
        
        .edu-brand-tag {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        
        .edu-title {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        }
        
        .edu-subtitle {
            font-size: 14px;
            color: #6b7280;
        }
        
        .edu-alert {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            color: #dc2626;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .edu-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .edu-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .edu-label {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }
        
        .edu-label-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .edu-input {
            width: 100% !important;
            padding: 14px 18px !important;
            font-size: 16px !important;
            font-family: inherit !important;
            color: #111827 !important;
            background: #ffffff !important;
            border: 2px solid #d1d5db !important;
            border-radius: 12px !important;
            outline: none !important;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .edu-input:focus {
            border-color: #0d9488 !important;
            box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1) !important;
        }
        
        .edu-input::placeholder {
            color: #9ca3af !important;
        }
        
        .edu-password-wrap {
            position: relative;
        }
        
        .edu-password-wrap .edu-input {
            padding-right: 50px !important;
        }
        
        .edu-eye-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border: none;
            border-radius: 8px;
            color: #6b7280;
            cursor: pointer;
        }
        
        .edu-eye-btn:hover {
            background: #f0fdfa;
            color: #0d9488;
        }
        
        .edu-link {
            font-size: 13px;
            font-weight: 600;
            color: #0d9488;
            text-decoration: none;
        }
        
        .edu-link:hover {
            color: #0f766e;
        }
        
        .edu-checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .edu-checkbox-row input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #0d9488;
        }
        
        .edu-checkbox-row label {
            font-size: 14px;
            color: #4b5563;
            cursor: pointer;
        }
        
        .edu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 600;
            font-family: inherit;
            color: white;
            background: linear-gradient(135deg, #0d9488, #0f766e);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .edu-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(13, 148, 136, 0.4);
        }
        
        .edu-divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 8px 0;
            color: #6b7280;
            font-size: 13px;
            text-transform: uppercase;
        }
        
        .edu-divider::before,
        .edu-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #e5e7eb;
        }
        
        .edu-social-row {
            display: flex;
            gap: 12px;
        }
        
        .edu-social-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 14px;
            background: #fff;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            text-decoration: none;
            color: #374151;
            transition: all 0.2s;
        }
        
        .edu-social-btn:hover {
            background: #f9fafb;
            border-color: #d1d5db;
            transform: translateY(-2px);
        }
        
        .edu-register-box {
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 15px;
            color: #4b5563;
        }
        
        .edu-register-box a {
            color: #0d9488;
            font-weight: 600;
            text-decoration: none;
        }
        
        .edu-register-box a:hover {
            text-decoration: underline;
        }
        
        .edu-footer {
            margin-top: 24px;
            text-align: center;
        }
        
        .edu-footer-links {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 12px;
        }
        
        .edu-footer-links a {
            font-size: 13px;
            color: #6b7280;
            text-decoration: none;
            padding: 4px 8px;
        }
        
        .edu-footer-links a:hover {
            color: #0d9488;
        }
        
        .edu-footer-links span {
            color: #d1d5db;
        }
        
        .edu-copyright {
            font-size: 12px;
            color: #9ca3af;
        }
        
        .edu-message {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .edu-message-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .edu-message-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .edu-message-warning { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
        .edu-message-info { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
        
        .edu-field-error {
            font-size: 12px;
            color: #dc2626;
            margin-top: 4px;
        }
        
        .edu-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        
        /* =========================================================
           RESPONSIVE DESIGN - Mobile First Approach
           ========================================================= */
        
        /* Extra Small Devices (Portrait Phones) - 320px to 480px */
        @media (max-width: 480px) {
            body {
                padding: 12px !important;
            }
            
            .edu-wrapper {
                max-width: 100%;
            }
            
            .edu-card {
                padding: 20px 16px !important;
                border-radius: 16px !important;
            }
            
            .edu-logo-row {
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .edu-logo-box {
                width: 48px;
                height: 48px;
            }
            
            .edu-brand-text {
                text-align: center;
            }
            
            .edu-brand-name {
                font-size: 22px;
            }
            
            .edu-brand-tag {
                font-size: 10px;
            }
            
            .edu-title {
                font-size: 18px;
            }
            
            .edu-subtitle {
                font-size: 12px;
            }
            
            .edu-form {
                gap: 16px;
            }
            
            .edu-field {
                gap: 6px;
            }
            
            .edu-label {
                font-size: 13px;
            }
            
            .edu-input {
                padding: 12px 14px !important;
                font-size: 16px !important; /* Prevents zoom on iOS */
                border-radius: 10px !important;
            }
            
            .edu-eye-btn {
                width: 40px;
                height: 40px;
                right: 8px;
            }
            
            .edu-btn {
                padding: 14px 20px !important;
                font-size: 15px !important;
                min-height: 48px;
                border-radius: 10px !important;
            }
            
            .edu-social-row {
                flex-direction: column;
                gap: 10px;
            }
            
            .edu-social-btn {
                padding: 12px !important;
                min-height: 48px;
            }
            
            .edu-form-row {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .edu-register-box {
                margin-top: 20px;
                padding-top: 18px;
                font-size: 13px;
            }
            
            .edu-footer {
                margin-top: 20px;
            }
            
            .edu-footer-links {
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .edu-footer-links a {
                font-size: 12px;
                padding: 4px 6px;
            }
            
            .edu-copyright {
                font-size: 11px;
            }
            
            .edu-alert,
            .edu-message {
                padding: 10px 12px !important;
                font-size: 13px !important;
            }
        }
        
        /* Small Devices (Landscape Phones) - 481px to 640px */
        @media (min-width: 481px) and (max-width: 640px) {
            .edu-wrapper {
                max-width: 100%;
            }
            
            .edu-card {
                padding: 28px 24px !important;
            }
            
            .edu-logo-box {
                width: 52px;
                height: 52px;
            }
            
            .edu-brand-name {
                font-size: 24px;
            }
        }
        
        /* Medium Devices (Tablets) - 641px to 768px */
        @media (min-width: 641px) and (max-width: 768px) {
            .edu-wrapper {
                max-width: 480px;
            }
            
            .edu-card {
                padding: 32px 28px !important;
            }
            
            .edu-logo-box {
                width: 56px;
                height: 56px;
            }
        }
        
        /* Large Devices (Tablets Landscape / Small Laptops) - 769px to 1024px */
        @media (min-width: 769px) and (max-width: 1024px) {
            .edu-wrapper {
                max-width: 460px;
            }
            
            body {
                padding: 20px !important;
            }
        }
        
        /* Extra Large Devices (Large Laptops / Desktops) - 1025px and up */
        @media (min-width: 1025px) {
            .edu-wrapper {
                max-width: 440px;
            }
            
            body {
                padding: 24px !important;
            }
        }
        
        /* Height-based Responsive Design */
        /* Very Short Screens (Mobile Landscape, Small Heights) */
        @media (max-height: 600px) {
            body {
                padding: 8px !important;
                align-items: flex-start !important;
                padding-top: 8px !important;
            }
            
            .edu-card {
                padding: 16px 18px !important;
            }
            
            .edu-logo-row {
                margin-bottom: 16px;
            }
            
            .edu-logo-box {
                width: 44px;
                height: 44px;
            }
            
            .edu-brand-name {
                font-size: 20px;
            }
            
            .edu-title {
                font-size: 16px;
                margin-bottom: 2px;
            }
            
            .edu-subtitle {
                font-size: 11px;
            }
            
            .edu-form {
                gap: 12px;
            }
            
            .edu-field {
                gap: 5px;
            }
            
            .edu-input {
                padding: 10px 12px !important;
                font-size: 14px !important;
            }
            
            .edu-btn {
                padding: 12px 18px !important;
                font-size: 14px !important;
            }
            
            .edu-register-box {
                margin-top: 14px;
                padding-top: 12px;
            }
        }
        
        /* Short Screens (Tablets Portrait, Medium Heights) */
        @media (min-height: 601px) and (max-height: 700px) {
            .edu-card {
                padding: 24px 22px !important;
            }
            
            .edu-logo-box {
                width: 50px;
                height: 50px;
            }
            
            .edu-form {
                gap: 16px;
            }
        }
        
        /* Medium Height Screens */
        @media (min-height: 701px) and (max-height: 800px) {
            .edu-card {
                padding: 32px 28px !important;
            }
        }
        
        /* Orientation-based Responsive Design */
        /* Landscape Orientation */
        @media (orientation: landscape) and (max-height: 600px) {
            body {
                padding: 8px 16px !important;
            }
            
            .edu-wrapper {
                max-width: 400px;
            }
            
            .edu-card {
                padding: 14px 18px !important;
            }
            
            .edu-logo-row {
                margin-bottom: 12px;
            }
            
            .edu-logo-box {
                width: 40px;
                height: 40px;
            }
            
            .edu-brand-name {
                font-size: 18px;
            }
            
            .edu-title {
                font-size: 15px;
                margin-bottom: 1px;
            }
            
            .edu-subtitle {
                font-size: 10px;
            }
            
            .edu-form {
                gap: 10px;
            }
            
            .edu-input {
                padding: 9px 11px !important;
                font-size: 14px !important;
            }
            
            .edu-btn {
                padding: 10px 16px !important;
                font-size: 13px !important;
            }
        }
        
        /* Portrait Orientation - Larger Screens */
        @media (orientation: portrait) and (min-width: 768px) {
            .edu-wrapper {
                max-width: 480px;
            }
        }
        
        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
            /* Larger touch targets for mobile devices */
            .edu-input {
                padding: 14px 16px !important;
                font-size: 16px !important; /* Prevents zoom on iOS */
            }
            
            .edu-eye-btn {
                width: 44px;
                height: 44px;
                min-height: 44px;
            }
            
            .edu-btn {
                padding: 16px 24px !important;
                min-height: 48px;
            }
            
            .edu-social-btn {
                min-height: 48px;
            }
            
            .edu-link {
                padding: 6px 10px;
                min-height: 36px;
                display: inline-flex;
                align-items: center;
            }
            
            .edu-checkbox-row input[type="checkbox"] {
                width: 20px;
                height: 20px;
            }
        }
        
        /* High DPI / Retina Displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .edu-logo-box svg {
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            }
        }
        
        /* Print Styles */
        @media print {
            body {
                background: white !important;
                padding: 0 !important;
            }
            
            .edu-card {
                box-shadow: none !important;
                border: 1px solid #ccc !important;
            }
        }
    </style>
</head>
<body>
    <div class="edu-wrapper">
        <div class="edu-card">
            <div class="edu-header">
                <#nested "header">
            </div>
            
            <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                <div class="edu-message edu-message-${message.type}">
                    <span>${kcSanitize(message.summary)?no_esc}</span>
                </div>
            </#if>
            
            <div class="edu-body">
                <#nested "form">
            </div>
            
            <#if displayInfo>
                <div class="edu-info">
                    <#nested "info">
                </div>
            </#if>
        </div>
    </div>
</body>
</html>
</#macro>
