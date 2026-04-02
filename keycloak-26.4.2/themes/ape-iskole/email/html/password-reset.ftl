<#import "template.ftl" as layout>
<@layout.emailLayout>
    <h1 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 16px;">
        Reset Your Password
    </h1>
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Hello,
    </p>
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        We received a request to reset your password for your account on Ape Iskole. You can reset it by clicking the button below:
    </p>
    <p style="text-align: center; margin-bottom: 32px;">
        <a href="${link}" class="button" style="display: inline-block; padding: 14px 28px; background-color: #2563EB; color: #FFFFFF; font-weight: 700; text-decoration: none; border-radius: 12px; font-size: 16px;">
            Set New Password
        </a>
    </p>
    <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
        This link will expire in <span style="font-weight: 700; color: #111827;">${linkExpiration} minutes</span>. If you did not request this, please ignore this email.
    </p>
    <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6;">
        If you're having trouble clicking the button, copy and paste the following URL into your browser:<br />
        <a href="${link}" style="color: #2563EB; word-break: break-all;">${link}</a>
    </p>
</@layout.emailLayout>
