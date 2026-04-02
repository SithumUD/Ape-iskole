# EduTrack Pro - Email Templates

This directory contains all email templates for the EduTrack Pro Keycloak theme. All templates are designed with a professional, school management system aesthetic matching the login theme.

## Available Templates

### Authentication Templates

1. **email-verification.ftl**
   - Sent when a user needs to verify their email address
   - Includes verification link with expiration notice
   - Subject: "Verify Your Email Address - EduTrack Pro"

2. **email-verification-with-code.ftl**
   - Alternative verification template using a code instead of a link
   - Displays verification code prominently
   - Subject: "Your Verification Code - EduTrack Pro"

3. **password-reset.ftl**
   - Sent when a user requests a password reset
   - Includes secure reset link with expiration
   - Subject: "Reset Your Password - EduTrack Pro"

4. **password-reset-confirmation.ftl**
   - Sent after a password has been successfully reset
   - Confirmation message with security tips
   - Subject: "Password Successfully Reset - EduTrack Pro"

### User Management Templates

5. **welcome.ftl**
   - Welcome email for newly registered users
   - Includes account details and getting started information
   - Subject: "Welcome to EduTrack Pro - Your Account is Ready!"

6. **invitation.ftl**
   - Sent to users invited by administrators
   - Includes account setup instructions
   - Subject: "You've Been Invited to Join EduTrack Pro"

### Event Notification Templates

7. **event-login.ftl**
   - Security notification for new login attempts
   - Includes IP address, client, and timestamp
   - Subject: "New Login Detected - EduTrack Pro"

8. **event-update-password.ftl**
   - Notification when password is changed
   - Includes security best practices
   - Subject: "Password Changed - EduTrack Pro"

9. **event-update-email.ftl**
   - Notification when email address is changed
   - Security alert if change was unauthorized
   - Subject: "Email Address Changed - EduTrack Pro"

## Design Features

- **Consistent Branding**: All emails feature the EduTrack Pro logo and gradient colors
- **Responsive Design**: Emails are optimized for both desktop and mobile email clients
- **Security Focused**: Clear security notices and best practices
- **Professional Layout**: Clean, modern design with proper spacing and typography
- **Accessibility**: High contrast, readable fonts, and clear call-to-action buttons

## Template Structure

All email templates use the base template (`email-template.ftl`) which provides:
- Consistent HTML structure
- Email client compatibility (including Outlook)
- Responsive layout
- Professional styling

## Customization

To customize email templates:

1. Edit the individual `.ftl` files in this directory
2. Modify colors, fonts, or layout as needed
3. Test emails in various email clients
4. Restart Keycloak to apply changes

## Keycloak Configuration

To use these email templates:

1. Ensure the `EDUTrackPro` theme is selected in your realm settings
2. Configure SMTP settings in Keycloak (Realm Settings → Email)
3. Test email delivery using the "Test connection" feature
4. Templates will automatically be used for corresponding events

## Variables Available

Common variables available in templates:
- `${user.username}` - User's username
- `${user.firstName}` - User's first name
- `${user.email}` - User's email address
- `${link}` - Action link (verification, reset, etc.)
- `${linkExpiration}` - Link expiration time
- `${code}` - Verification code (for code-based templates)
- `${codeExpiration}` - Code expiration time
- `${event.ipAddress}` - IP address (for event templates)
- `${event.date}` - Event date/time
- `${client.baseUrl}` - Application base URL
- `${realm.displayName}` - Realm/organization name

## Notes

- All templates are HTML-based for rich email formatting
- Text-only versions are not included (Keycloak generates these automatically)
- Email subjects are defined within each template
- Templates use inline CSS for maximum email client compatibility

