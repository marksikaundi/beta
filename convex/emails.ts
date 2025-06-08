import { Resend } from "resend";
import { v } from "convex/values";
import { action } from "./_generated/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteEmail = action({
  args: {
    to: v.string(),
    inviterName: v.string(),
  },
  handler: async (ctx, args) => {
    const { to, inviterName } = args;

    try {
      const result = await resend.emails.send({
        from: "CodePlex <invites@codeplex.dev>",
        to: [to],
        subject: `${inviterName} invited you to join CodePlex`,
        html: `
          <div>
            <h1>You've been invited to CodePlex!</h1>
            <p>${inviterName} has invited you to join CodePlex, the interactive learning platform for developers.</p>
            <p>Click the button below to join:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-up?invite=true" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;">
              Accept Invitation
            </a>
            <p>Looking forward to seeing you there!</p>
          </div>
        `,
      });

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  },
});
