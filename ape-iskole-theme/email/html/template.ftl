<#macro emailLayout>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${subject!""}</title>
    <style type="text/css" rel="stylesheet" media="all">
    /* Formatting ------------------------------------------------------- */
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      line-height: 1.4;
      background-color: #F2F4F6;
      color: #1F2937;
      -webkit-text-size-adjust: none;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    a {
      color: #2563EB;
      text-decoration: underline;
    }
    /* Data table ------------------------------------------------------- */
    .purchase {
      width: 100%;
      margin: 0;
      padding: 35px 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    .purchase_content {
      width: 100%;
      margin: 0;
      padding: 25px 35px;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    .purchase_item {
      padding: 10px 0;
      color: #1F2937;
      font-size: 15px;
      line-height: 18px;
    }
    /* Utilities ------------------------------------------------------- */
    .align-right {
      text-align: right;
    }
    .align-left {
      text-align: left;
    }
    .align-center {
      text-align: center;
    }
    /* Buttons ------------------------------------------------------- */
    .button {
      background-color: #2563EB;
      border-top: 10px solid #2563EB;
      border-right: 18px solid #2563EB;
      border-bottom: 10px solid #2563EB;
      border-left: 18px solid #2563EB;
      display: inline-block;
      color: #FFF;
      text-decoration: none;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      -webkit-text-size-adjust: none;
      font-weight: 700;
      font-size: 16px;
    }
    .button:hover {
      background-color: #1D4ED8;
      border-color: #1D4ED8;
    }
    .button--green {
      background-color: #22C55E;
      border-color: #22C55E;
    }
    .button--green:hover {
      background-color: #16A34A;
      border-color: #16A34A;
    }
    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
      }
    }
    </style>
</head>
<body style="width: 100% !important; height: 100%; margin: 0; line-height: 1.4; background-color: #F5F7FA; color: #1F2937; -webkit-text-size-adjust: none; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F5F7FA;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table class="email-content" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;">
                    <!-- Logo / Brand Header -->
                    <tr>
                        <td class="email-masthead" style="padding: 0 0 32px 0; text-align: center;">
                            <div style="display: inline-block; padding: 12px; background: #2563EB; border-radius: 12px; box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2); margin-bottom: 12px;">
                                <span style="color: #FFFFFF; font-size: 24px; font-weight: 800; display: block; width: 40px; height: 40px; line-height: 40px; text-align: center;">A</span>
                            </div>
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">
                                APE <span style="color: #2563EB;">ISKOLE</span>
                            </h1>
                            <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em;">
                                THE PLATFORM FOR EDUCATION
                            </p>
                        </td>
                    </tr>
                    <!-- Email Body -->
                    <tr>
                        <td class="email-body" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; border-top: 6px solid #2563EB; border-bottom: 1px solid #E5E7EB; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06);">
                            <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" style="width: 570px; margin: 0 auto; padding: 40px 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;">
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding: 0 35px;">
                                        <#nested>
                                    </td>
                                </tr>
                                <!-- Support Info -->
                                <tr>
                                    <td style="padding: 40px 35px 0 35px;">
                                        <p style="font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 8px;">
                                            Need help?
                                        </p>
                                        <p style="font-size: 13px; color: #9CA3AF; line-height: 1.6;">
                                            If you have any questions, please reply to this email or contact our support team at <a href="mailto:support@apeiskole.lk" style="color: #2563EB; text-decoration: none;">support@apeiskole.lk</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Email Footer -->
                    <tr>
                        <td style="padding: 40px 0;">
                            <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" style="width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center;">
                                <tr>
                                    <td style="padding: 0 35px;">
                                        <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-bottom: 12px;">
                                            &copy; ${.now?string('yyyy')} Ape Iskole. All rights reserved.
                                        </p>
                                        <div style="font-size: 12px; color: #D1D5DB; text-align: center;">
                                            If you didn't request this email, you can safely ignore it.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
</#macro>
