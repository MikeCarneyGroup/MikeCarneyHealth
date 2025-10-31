/**
 * Mailgun Email Service
 * 
 * Handles sending emails via Mailgun API.
 * Requires MAILGUN_API_KEY, MAILGUN_DOMAIN, and MAILGUN_FROM_EMAIL
 * environment variables to be configured.
 */

import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun client
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || '';

/**
 * Send an email using Mailgun
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Validate configuration
    if (!process.env.MAILGUN_API_KEY) {
      throw new Error('MAILGUN_API_KEY is not configured');
    }
    if (!MAILGUN_DOMAIN) {
      throw new Error('MAILGUN_DOMAIN is not configured');
    }
    if (!FROM_EMAIL) {
      throw new Error('MAILGUN_FROM_EMAIL is not configured');
    }

    // Ensure 'to' is an array
    const recipients = Array.isArray(to) ? to : [to];

    // Send email
    const response = await mg.messages.create(MAILGUN_DOMAIN, {
      from: from || FROM_EMAIL,
      to: recipients,
      subject,
      html,
      text: text || '',
    });

    console.log('Email sent successfully:', response.id);
    return {
      success: true,
      id: response.id,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a submission notification email to admins
 */
export async function sendSubmissionNotification({
  submissionType,
  submitterName,
  submitterEmail,
  adminEmail,
}: {
  submissionType: string;
  submitterName: string;
  submitterEmail: string;
  adminEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `New ${submissionType} Submission - Mike Carney Wellbeing Hub`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Submission Received</h2>
      <p>A new ${submissionType.toLowerCase()} has been submitted to the Mike Carney Wellbeing Hub.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>Type:</strong> ${submissionType}</p>
        <p style="margin: 10px 0;"><strong>Submitted by:</strong> ${submitterName}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> ${submitterEmail}</p>
      </div>
      
      <p>Please log in to the admin panel to review and respond to this submission.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/submissions" 
         style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        View Submission
      </a>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      
      <p style="color: #6b7280; font-size: 14px;">
        This is an automated notification from Mike Carney Wellbeing Hub.
      </p>
    </div>
  `;

  const text = `
New ${submissionType} Submission

A new ${submissionType.toLowerCase()} has been submitted to the Mike Carney Wellbeing Hub.

Type: ${submissionType}
Submitted by: ${submitterName}
Email: ${submitterEmail}

Please log in to the admin panel to review and respond to this submission.

View at: ${process.env.NEXT_PUBLIC_APP_URL}/admin/submissions
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
  });
}

/**
 * Send a response notification to a user
 */
export async function sendResponseNotification({
  userName,
  userEmail,
  submissionType,
  responseMessage,
}: {
  userName: string;
  userEmail: string;
  submissionType: string;
  responseMessage: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Response to Your ${submissionType} - Mike Carney Wellbeing Hub`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Response to Your Submission</h2>
      <p>Hi ${userName},</p>
      
      <p>Thank you for your ${submissionType.toLowerCase()} on the Mike Carney Wellbeing Hub. We've reviewed your submission and wanted to get back to you.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Response:</h3>
        <p style="white-space: pre-wrap;">${responseMessage}</p>
      </div>
      
      <p>If you have any questions or need further assistance, please don't hesitate to submit another request through the portal.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
         style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Visit Wellbeing Hub
      </a>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      
      <p style="color: #6b7280; font-size: 14px;">
        This email was sent to you because you submitted a request on the Mike Carney Wellbeing Hub.
      </p>
    </div>
  `;

  const text = `
Response to Your ${submissionType}

Hi ${userName},

Thank you for your ${submissionType.toLowerCase()} on the Mike Carney Wellbeing Hub. We've reviewed your submission and wanted to get back to you.

Response:
${responseMessage}

If you have any questions or need further assistance, please don't hesitate to submit another request through the portal.

Visit: ${process.env.NEXT_PUBLIC_APP_URL}
  `;

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text,
  });
}

