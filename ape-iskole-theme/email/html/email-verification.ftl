<#import "template.ftl" as layout>
<@layout.emailLayout>
    <h1 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 16px;">
        Verify Your Email Address
    </h1>
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Hello,
    </p>
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Thank you for joining Ape Iskole! To complete your registration and verify your email address, please click the button below:
    </p>
    <p style="text-align: center; margin-bottom: 32px;">
        <a href="${link}" class="button button--green" style="display: inline-block; padding: 14px 28px; background-color: #22C55E; color: #FFFFFF; font-weight: 700; text-decoration: none; border-radius: 12px; font-size: 16px;">
            Verify Email Address
        </a>
    </p>
    <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
        This link will expire in <span style="font-weight: 700; color: #111827;">${linkExpiration} minutes</span>.
    </p>
    <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6;">
        If you're having trouble clicking the button, copy and paste the following URL into your browser:<br />
        <a href="${link}" style="color: #2563EB; word-break: break-all;">${link}</a>
    </p>
</@layout.emailLayout>
