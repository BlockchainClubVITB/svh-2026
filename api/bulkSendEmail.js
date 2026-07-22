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
    bccRecipients  // Array of email strings (BCC)
  } = req.body;

  if (!subject || !body || !Array.isArray(bccRecipients) || bccRecipients.length === 0) {
    return res.status(400).json({ message: 'Missing required fields: subject, body, or bccRecipients array.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const primaryTo = toEmail && toEmail.trim() 
      ? toEmail.trim() 
      : `"Blockchain Club, VIT Bhopal" <blockchainvitb@gmail.com>`;

    // Gmail SMTP limits a single email to 100 recipients max.
    // We will chunk the BCC list into batches of 80 to remain safely under the limit.
    const chunkSize = 80;
    const totalRecipients = bccRecipients.length;
    const totalChunks = Math.ceil(totalRecipients / chunkSize);

    console.log(`[Bulk Email Dispatch] Initiating production send for ${totalRecipients} recipients across ${totalChunks} chunks.`);

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

      // Throttling: Delay 300ms between batches to prevent SMTP rate-limit blocks
      if (i + chunkSize < totalRecipients) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Successfully dispatched bulk email to all ${totalRecipients} recipients across ${totalChunks} batches.` 
    });

  } catch (error) {
    console.error('Nodemailer Chunked Bulk Send Error:', error);
    return res.status(500).json({ message: 'Failed to complete bulk email broadcast.', error: error.message });
  }
}
