import { Resend } from "resend";
import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const EMAIL_HTML_TEMPLATE = (inviterName: string, signUpUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join CodePlex</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333; margin-bottom: 20px;">You've been invited to CodePlex!</h1>
    <p style="color: #666; margin-bottom: 16px;">${inviterName} has invited you to join CodePlex, the interactive learning platform for developers.</p>
    <p style="color: #666; margin-bottom: 24px;">Click the button below to join:</p>
    <a href="${signUpUrl}" 
       style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 500;">
      Accept Invitation
    </a>
    <p style="color: #666; margin-top: 24px;">Looking forward to seeing you there!</p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">
      If you didn't expect this invitation, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
`;

export const sendInviteEmail = internalAction({
  args: {
    to: v.string(),
    inviterName: v.string(),
  },
  handler: async (ctx, args): Promise<EmailResult> => {
    const { to, inviterName } = args;

    // Validate email format
    if (!to.includes("@")) {
      return {
        success: false,
        error: "Invalid email address format",
      };
    }

    // Get environment variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const APP_URL = process.env.APP_URL;

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    if (!APP_URL) {
      console.error("Missing APP_URL environment variable");
      return {
        success: false,
        error: "Application URL not configured",
      };
    }

    // Create Resend client
    const resend = new Resend(RESEND_API_KEY);

    try {
      // Generate sign up URL with invite token
      const signUpUrl = `${APP_URL}/sign-up?invite=true&email=${encodeURIComponent(
        to
      )}`;

      // Send email
      const result = await resend.emails.send({
        from: "CodePlex <noreply@codeplex.dev>",
        replyTo: "support@codeplex.dev",
        to: [to],
        subject: `${inviterName} invited you to join CodePlex`,
        html: EMAIL_HTML_TEMPLATE(inviterName, signUpUrl),
        headers: {
          "X-Entity-Ref-ID": new Date().getTime().toString(),
        },
      });

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      // Log the detailed error for debugging
      console.error("Failed to send invite email:", {
        error,
        to,
        inviterName,
        timestamp: new Date().toISOString(),
      });

      // Return a user-friendly error
      let errorMessage = "Failed to send email";

      if (error instanceof Error) {
        if (
          error.message.includes("domain") ||
          error.message.includes("sender")
        ) {
          errorMessage = "Email configuration error. Please contact support.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many emails sent. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});
