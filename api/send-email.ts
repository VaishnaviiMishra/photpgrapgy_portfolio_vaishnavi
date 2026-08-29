import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Support CORS for client-side invokes if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, serviceType, eventDate, location, message } = req.body || {};

    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: 'Name and either Email or Phone are required.' });
    }

    const emailUser = (process.env.EMAIL_USER || process.env.VITE_EMAIL_USER || 'vaishnavisudha111@gmail.com').trim();
    const rawPass = process.env.EMAIL_PASS || process.env.VITE_EMAIL_PASS || '';
    const emailPass = rawPass.replace(/\s+/g, '');
    const recipientEmail = (process.env.EMAIL_TO || process.env.VITE_EMAIL_TO || 'vaishnavisudha111@gmail.com').trim();

    if (!emailPass) {
      console.warn('EMAIL_PASS not configured in environment variables.');
      return res.status(500).json({ 
        error: 'Email service is not configured with an App Password yet. Please set EMAIL_PASS in Vercel environment variables or contact directly via WhatsApp.' 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f1f3; padding: 30px; color: #2B141C;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e8d0d8; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <div style="background: linear-gradient(135deg, #DE4373, #BF2C5B); padding: 25px 30px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold;">New Photography Inquiry</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Vaishnavi Mishra Portfolio Portal</p>
          </div>

          <div style="padding: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: bold; width: 140px; color: #BF2C5B;">Service:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: 600; color: #111827;">${serviceType || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: bold; color: #BF2C5B;">Client Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: bold; color: #BF2C5B;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7;"><a href="mailto:${email}" style="color: #DE4373; text-decoration: none;">${email || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: bold; color: #BF2C5B;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: bold; color: #BF2C5B;">Target Date:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; color: #111827;">${eventDate || 'Flexible'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; font-weight: bold; color: #BF2C5B;">Location:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e2e7; color: #111827;">${location || 'Not specified'}</td>
              </tr>
            </table>

            <div style="margin-top: 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #BF2C5B; font-weight: bold; text-transform: uppercase;">Message & Vision:</h3>
              <div style="background-color: #fdf6f8; border-left: 4px solid #DE4373; padding: 15px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #374151;">
                ${(message || 'No additional notes provided.').replace(/\n/g, '<br/>')}
              </div>
            </div>
          </div>

          <div style="background: #faf4f6; padding: 15px 30px; text-align: center; font-size: 12px; color: #886a74; border-top: 1px solid #f0e2e7;">
            Sent directly from <a href="https://github.com/VaishnaviiMishra/photpgrapgy_portfolio_vaishnavi" style="color: #DE4373; text-decoration: none;">vaishnavimishra.com</a> portfolio
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Portfolio Inquiry" <${emailUser}>`,
      to: recipientEmail,
      replyTo: email || emailUser,
      subject: `📸 New Shoot Inquiry: ${serviceType || 'Photography'} - ${name}`,
      text: `New Photography Inquiry\n\nName: ${name}\nService: ${serviceType}\nEmail: ${email}\nPhone: ${phone}\nDate: ${eventDate}\nLocation: ${location}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, message: 'Your inquiry has been sent directly to Vaishnavi!' });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to send email. Please try again or reach out via WhatsApp.' 
    });
  }
}
