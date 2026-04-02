<#import "email-template.ftl" as layout>
<@layout.emailLayout>
    <#assign subject = "Your Verification Code - EduTrack Pro">
    
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
                            Verify Your Email Address
                        </h2>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                            Welcome to <strong>EduTrack Pro</strong>! Please use the verification code below to complete your email verification.
                        </p>
                        <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #6b7280; text-align: center;">
                            This code will expire in <strong>${codeExpiration}</strong>. Enter it in the verification page to activate your account.
                        </p>
                    </td>
                </tr>
                
                <#-- Verification Code -->
                <tr>
                    <td align="center" style="padding: 0 40px 30px;">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td align="center" style="padding: 30px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 16px; border: 2px dashed #3b82f6;">
                                    <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">
                                        Your Verification Code
                                    </p>
                                    <p style="margin: 0; font-size: 36px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                        ${code}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <#-- Instructions -->
                <tr>
                    <td style="padding: 0 40px 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9fafb; border-radius: 12px; padding: 20px;">
                            <tr>
                                <td>
                                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #111827;">
                                        How to verify:
                                    </p>
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td style="padding: 6px 0; font-size: 13px; color: #4b5563;">
                                                1. Return to the verification page
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0; font-size: 13px; color: #4b5563;">
                                                2. Enter the code shown above
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0; font-size: 13px; color: #4b5563;">
                                                3. Click "Verify" to complete the process
                                            </td>
                                        </tr>
                                    </table>
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
                    <td style="padding: 20px; background: #f9fafb; border-radius: 12px; border-left: 4px solid #6366f1;">
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                            <strong style="color: #111827;">Security Notice:</strong> Never share this code with anyone. EduTrack Pro staff will never ask for your verification code. If you didn't request this code, please ignore this email.
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

