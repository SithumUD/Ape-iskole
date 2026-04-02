<#import "email-template.ftl" as layout>
<@layout.emailLayout>
    <#assign subject = "You've Been Invited to Join EduTrack Pro">
    
    <#-- Email Header -->
    <tr>
        <td align="center" style="padding: 40px 20px 30px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                    <td align="center" style="padding-bottom: 20px;">
                        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #4f46e5, #3b82f6); border-radius: 14px; display: inline-block; box-shadow: 0 8px 24px -6px rgba(59, 130, 246, 0.5);">
                            <svg width="32" height="32" viewBox="0 0 32 32" style="margin: 12px;" fill="white">
                                <path d="M14 21v-3a2 2 0 0 0-4 0v3"/>
                                <path d="M18 5v16"/>
                                <path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6"/>
                                <path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11"/>
                                <path d="M6 5v16"/>
                                <circle cx="12" cy="9" r="2"/>
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
                            You've Been Invited!
                        </h2>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                            Hello <strong>${user.firstName!user.username}</strong>,
                        </p>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                            You've been invited to join <strong>EduTrack Pro</strong>, our comprehensive school management system. An administrator has created an account for you.
                        </p>
                        <#if realm.displayName??>
                        <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #6b7280; text-align: center;">
                            Organization: <strong>${realm.displayName}</strong>
                        </p>
                        </#if>
                    </td>
                </tr>
                
                <#-- Account Details -->
                <tr>
                    <td style="padding: 0 40px 30px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9fafb; border-radius: 12px; padding: 20px;">
                            <tr>
                                <td style="padding-bottom: 12px;">
                                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Your Account Information
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px;">
                                    <p style="margin: 0; font-size: 14px; color: #111827;">
                                        <strong>Username:</strong> ${user.username}
                                    </p>
                                </td>
                            </tr>
                            <#if user.email??>
                            <tr>
                                <td>
                                    <p style="margin: 0; font-size: 14px; color: #111827;">
                                        <strong>Email:</strong> ${user.email}
                                    </p>
                                </td>
                            </tr>
                            </#if>
                        </table>
                    </td>
                </tr>
                
                <#-- Accept Invitation Button -->
                <tr>
                    <td align="center" style="padding: 0 40px 30px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #4f46e5, #3b82f6); box-shadow: 0 6px 20px -6px rgba(99, 102, 241, 0.5);">
                                    <a href="${link}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px;">
                                        Accept Invitation & Set Password
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <#-- Alternative Link -->
                <tr>
                    <td align="center" style="padding: 0 40px 40px;">
                        <p style="margin: 0 0 12px; font-size: 13px; color: #9ca3af; text-align: center;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #6366f1; word-break: break-all; text-align: center; padding: 0 20px;">
                            ${link}
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    
    <#-- Next Steps -->
    <tr>
        <td align="center" style="padding: 30px 20px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                    <td style="padding: 20px; background: #f0f9ff; border-radius: 12px;">
                        <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #111827; text-align: center;">
                            Next Steps:
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #4b5563;">
                                    1. Click the button above to accept the invitation
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #4b5563;">
                                    2. Set a secure password for your account
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #4b5563;">
                                    3. Verify your email address (if required)
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #4b5563;">
                                    4. Start using EduTrack Pro!
                                </td>
                            </tr>
                        </table>
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
                            Questions? Contact our support team
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

