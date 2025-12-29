import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  membership: string;
  planType: string;
};

type ContactResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, phone, message, membership, planType } = req.body as ContactFormData;

    // Validate required fields
    if (!name || !email || !message || !membership) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "Name, email, message, and membership are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Configure email transporter
    // For production, use environment variables for SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // If no SMTP credentials are configured, log the message (for development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log("=== CONTACT FORM SUBMISSION ===");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone || "Not provided");
      console.log("Membership:", membership);
      console.log("Plan Type:", planType);
      console.log("Message:", message);
      console.log("==============================");

      return res.status(200).json({
        success: true,
        message: "Thank you for reaching out! We will respond shortly.",
      });
    }

    // Prepare email content
    const recipientEmail = process.env.CONTACT_EMAIL || "info@theelitesport.com";
    
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: recipientEmail,
      subject: `New Contact Form Submission - ${membership} Membership`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-radius: 3px; }
              .message-box { padding: 15px; background-color: #f0f0f0; border-left: 4px solid #007bff; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ""}
              
              <div class="field">
                <div class="label">Membership Type:</div>
                <div class="value">${membership}</div>
              </div>
              
              <div class="field">
                <div class="label">Plan Type:</div>
                <div class="value">${planType}</div>
              </div>
              
              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Membership Type: ${membership}
Plan Type: ${planType}

Message:
${message}
      `.trim(),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out! We will respond shortly.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

