<#import "email-template.ftl" as layout>
<@layout.emailLayout>
    <#assign subject = "Password Successfully Reset - EduTrack Pro">
    
    <#-- Email Header -->
    <tr>
        <td align="center" style="padding: 40px 20px 30px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                    <td align="center" style="padding-bottom: 20px;">
                        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 14px; display: inline-block; box-shadow: 0 8px 24px -6px rgba(16, 185, 129, 0.5);">
                            <svg width="32" height="32" viewBox="0 0 24 24" style="margin: 12px;" fill="white">
                                <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            </svg>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding-bottom: 10px;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827; background: linear-gradient(135deg, #4f46e5, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            EduTrack Pro
                        </h1>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    
    <#-- Email Content -->
    <tr>
        <td align="center" style="padding: 0 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                <tr>
                    <td style="padding: 40px 40px 30px;">
                        <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                            Password Successfully Reset
                        </h2>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                            Your password for your <strong>EduTrack Pro</strong> account has been successfully changed.
                        </p>
                        <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #6b7280; text-align: center;">
                            If you made this change, you can safely ignore this email. If you didn't make this change, please contact our support team immediately.
                        </p>
                    </td>
                </tr>
                
                <#-- Action Button -->
                <tr>
                    <td align="center" style="padding: 0 40px 30px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #4f46e5, #3b82f6); box-shadow: 0 6px 20px -6px rgba(99, 102, 241, 0.5);">
                                    <a href="${client.baseUrl}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px;">
                                        Sign In to Your Account
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    
    <#-- Security Notice -->
    <tr>
        <td align="center" style="padding: 30px 20px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                    <td style="padding: 20px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #10b981;">
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                            <strong style="color: #059669;">Security Tip:</strong> For your account security, we recommend using a strong, unique password and enabling two-factor authentication if available.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    
    <#-- Footer -->
    <tr>
        <td align="center" style="padding: 30px 20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                    <td align="center" style="padding-bottom: 20px; border-top: 1px solid #e5e7eb; padding-top: 30px;">
                        <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">
                            Need help? Contact our support team
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                            © ${.now?string("yyyy")} EduTrack Pro. All rights reserved.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</@layout.emailLayout>

