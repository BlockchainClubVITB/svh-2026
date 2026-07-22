import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    subject,
    body,
    isHtml,
    toEmail,       // Custom To email string (optional)
    bccRecipients, // Array of email strings (BCC)
    dryRun         // Dry run flag (optional)
  } = req.body;

  if (!subject || !body || !Array.isArray(bccRecipients) || bccRecipients.length === 0) {
    return res.status(400).json({ message: 'Missing required fields: subject, body, or bccRecipients array.' });
  }

  try {
    const primaryTo = toEmail && toEmail.trim() 
      ? toEmail.trim() 
      : `"Blockchain Club, VIT Bhopal" <blockchainvitb@gmail.com>`;

    const chunkSize = 80;
    const totalRecipients = bccRecipients.length;
    const totalChunks = Math.ceil(totalRecipients / chunkSize);

    console.log(`[Bulk Email Dispatch] Mode: ${dryRun ? 'DRY RUN' : 'PRODUCTION'}. Total Recipients: ${totalRecipients}. Chunks: ${totalChunks}.`);

    if (!dryRun) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      for (let i = 0; i < totalRecipients; i += chunkSize) {
        const chunk = bccRecipients.slice(i, i + chunkSize);
        
        const mailOptions = {
          from: `"Blockchain Club, VIT Bhopal" <blockchainvitb@gmail.com>`,
          to: primaryTo,
          bcc: chunk.join(', '),
          subject: subject,
        };

        if (isHtml) {
          mailOptions.html = body;
        } else {
          mailOptions.text = body;
        }

        const chunkIndex = Math.floor(i / chunkSize) + 1;
        console.log(`[Bulk Email Dispatch] Dispatching Chunk ${chunkIndex}/${totalChunks} (${chunk.length} recipients)...`);
        
        await transporter.sendMail(mailOptions);

        if (i + chunkSize < totalRecipients) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    } else {
      // Dry run simulation mode logs details to server console
      for (let i = 0; i < totalRecipients; i += chunkSize) {
        const chunk = bccRecipients.slice(i, i + chunkSize);
        const chunkIndex = Math.floor(i / chunkSize) + 1;
        console.log(`[Dry Run Mode] Batch ${chunkIndex}/${totalChunks} simulated for ${chunk.length} recipients.`);
      }
    }

    const messageResult = dryRun 
      ? `Dry-Run Mode: Successfully simulated broadcast to all ${totalRecipients} recipients across ${totalChunks} batches (no emails were sent).`
      : `Successfully dispatched bulk email to all ${totalRecipients} recipients across ${totalChunks} batches.`;

    return res.status(200).json({ 
      success: true, 
      message: messageResult
    });

  } catch (error) {
    console.error('Nodemailer Chunked Bulk Send Error:', error);
    return res.status(500).json({ message: 'Failed to complete bulk email broadcast.', error: error.message });
  }
}
