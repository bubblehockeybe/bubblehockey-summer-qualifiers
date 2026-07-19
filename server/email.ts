import { ENV } from "./_core/env";

interface EmailRecipient {
  email: string;
  name: string;
}

interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent: string;
}

/**
 * Send an email via SendGrid API
 */
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (!ENV.sendgridApiKey) {
    console.warn("[Email] SendGrid API key not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: params.to.map((recipient) => ({
              email: recipient.email,
              name: recipient.name,
            })),
            subject: params.subject,
          },
        ],
        from: {
          email: "noreply@bubblehockey.be",
          name: "Bubble Hockey",
        },
        content: [
          {
            type: "text/plain",
            value: params.textContent,
          },
          {
            type: "text/html",
            value: params.htmlContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Email] SendGrid API error:", response.status, errorText);
      return false;
    }

    console.log("[Email] Successfully sent confirmation email to", params.to.length, "recipients");
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send confirmation email when a training session reaches 4+ signups
 */
export async function sendTrainingConfirmationEmail(
  trainingDate: string,
  recipients: Array<{ name: string; email: string }>
): Promise<boolean> {
  const dateFormatted = formatTrainingDate(trainingDate);

  const subject = `[Bubble Hockey] Entraînement du ${dateFormatted} confirmé!`;

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ff2d55;">🎮 Entraînement Confirmé! 🎮</h2>
          
          <p>Bonjour,</p>
          
          <p>Nous avons le plaisir de vous annoncer que l'entraînement Bubble Hockey du <strong>${dateFormatted}</strong> est maintenant <strong>confirmé</strong>!</p>
          
          <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #00f5ff; margin: 20px 0;">
            <p><strong>📅 Date:</strong> ${dateFormatted}</p>
            <p><strong>⏰ Horaire:</strong> 19h00 - 20h00 (entraînement)</p>
            <p><strong>📍 Lieu:</strong> Brussels Pinball Museum, 1501 Chaussée de Wavre, 1160 Auderghem</p>
            <p><strong>👥 Participants:</strong> ${recipients.length} inscrits</p>
          </div>
          
          <p>À bientôt sur la glace!</p>
          
          <p style="margin-top: 30px; color: #999; font-size: 12px;">
            Bubble Hockey Summer Qualifiers<br/>
            Brussels Pinball Museum
          </p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Entraînement Confirmé!

Bonjour,

Nous avons le plaisir de vous annoncer que l'entraînement Bubble Hockey du ${dateFormatted} est maintenant confirmé!

📅 Date: ${dateFormatted}
⏰ Horaire: 19h00 - 20h00 (entraînement)
📍 Lieu: Brussels Pinball Museum, 1501 Chaussée de Wavre, 1160 Auderghem
👥 Participants: ${recipients.length} inscrits

À bientôt sur la glace!

Bubble Hockey Summer Qualifiers
Brussels Pinball Museum
  `;

  return sendEmail({
    to: recipients,
    subject,
    htmlContent,
    textContent,
  });
}

/**
 * Format training date from "19/07" to "19 juillet" or "July 19"
 */
function formatTrainingDate(dateStr: string): string {
  const [day, month] = dateStr.split("/");
  const monthNames: Record<string, string> = {
    "07": "juillet",
    "08": "août",
  };
  return `${day} ${monthNames[month] || month}`;
}
