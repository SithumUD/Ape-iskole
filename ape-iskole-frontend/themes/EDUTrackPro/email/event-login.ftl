<#import "email-template.ftl" as layout>
<@layout.emailLayout>
    <#assign subject = "New Login Detected - EduTrack Pro">
    
    <#-- Email Header -->
    <tr>
        <td align="center" style="padding: 40px 20px 30px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                    <td align="center" style="padding-bottom: 20px;">
                        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 14px; display: inline-block; box-shadow: 0 8px 24px -6px rgba(245, 158, 11, 0.5);">
                            <svg width="32" height="32" viewBox="0 0 24 24" style="margin: 12px;" fill="white">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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
                            New Login Detected
                        </h2>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                            Hello <strong>${user.firstName!user.username}</strong>,
                        </p>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                            We detected a new login to your <strong>EduTrack Pro</strong> account.
                        </p>
                    </td>
                </tr>
                
                <#-- Login Details -->
                <tr>
                    <td style="padding: 0 40px 30px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9fafb; border-radius: 12px; padding: 20px;">
                            <tr>
                                <td style="padding-bottom: 12px;">
                                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Login Details
                                    </p>
                                </td>
                            </tr>
                            <#if event.ipAddress??>
                            <tr>
                                <td style="padding-bottom: 8px;">
                                    <p style="margin: 0; font-size: 14px; color: #111827;">
                                        <strong>IP Address:</strong> ${event.ipAddress}
                                    </p>
                                </td>
                            </tr>
                            </#if>
                            <#if event.clientId??>
                            <tr>
                                <td style="padding-bottom: 8px;">
                                    <p style="margin: 0; font-size: 14px; color: #111827;">
                                        <strong>Client:</strong> ${event.clientId}
                                    </p>
                                </td>
                            </tr>
                            </#if>
                            <#if event.date??>
                            <tr>
                                <td>
                                    <p style="margin: 0; font-size: 14px; color: #111827;">
                                        <strong>Time:</strong> ${event.date?string("MMM dd, yyyy 'at' HH:mm:ss")}
                                    </p>
                                </td>
                            </tr>
                            </#if>
                        </table>
                    </td>
                </tr>
                
                <#-- Action Button -->
                <tr>
                    <td align="center" style="padding: 0 40px 30px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #4f46e5, #3b82f6); box-shadow: 0 6px 20px -6px rgba(99, 102, 241, 0.5);">
                                    <a href="${client.baseUrl}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px;">
                                        View Account Activity
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
                    <td style="padding: 20px; background: #fffbeb; border-radius: 12px; border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                            <strong style="color: #d97706;">Security Alert:</strong> If you didn't make this login, please change your password immediately and contact our support team. Your account security is important to us.
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

