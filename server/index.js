import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://reiki-website.netlify.app'
  ]
}));
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
app.get('/api/services', async (req, res) => {
    try {
    const result = await pool.query("SELECT * FROM services ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST contact form → save to DB + email Vibha
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    // 1. Save to PostgreSQL
   const result = await pool.query(
  'INSERT INTO contact_messages (name, email, phone, service, message) VALUES ($1,$2,$3,$4,$5) RETURNING *',
  [name, email, phone || null, service || null, message]
);

console.log("DB INSERT SUCCESS:", result.rows);

    // 2. Send email to Vibha
    const mailToVibha = {
      from: `"Golden Hands Website" <${process.env.SMTP_USER}>`,
      to: process.env.VIBHA_EMAIL || 'healervibha@gmail.com',
      subject: `✨ New Inquiry from ${name} – Golden Hands`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #fdf8f0; padding: 32px; border-radius: 12px; border: 1px solid #e8d5b0;">
          <h2 style="color: #8b6914; text-align: center; letter-spacing: 2px;">GOLDEN HANDS</h2>
          <p style="color: #6b5b3e; text-align: center; font-style: italic;">New Contact Form Submission</p>
          <hr style="border-color: #e8d5b0; margin: 24px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8b6914; font-weight: bold; width: 120px;">Name</td><td style="color: #3d2b0f;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #8b6914; font-weight: bold;">Email</td><td style="color: #3d2b0f;">${email}</td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #8b6914; font-weight: bold;">Phone</td><td style="color: #3d2b0f;">${phone}</td></tr>` : ''}
            ${service ? `<tr><td style="padding: 8px 0; color: #8b6914; font-weight: bold;">Service</td><td style="color: #3d2b0f;">${service}</td></tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #fff8e8; border-radius: 8px; border-left: 3px solid #d4a017;">
            <p style="color: #8b6914; font-weight: bold; margin: 0 0 8px;">Message:</p>
            <p style="color: #3d2b0f; margin: 0; line-height: 1.6;">${message}</p>
          </div>
          <p style="text-align:center; color:#b8972d; margin-top:28px; font-size:12px;">Sent via Golden Hands website contact form</p>
        </div>
      `,
    };

    // 3. Auto-reply to the user
    const mailToUser = {
      from: `"Vibha – Golden Hands Reiki" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '✨ Thank you for reaching out – Golden Hands Reiki',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #fdf8f0; padding: 32px; border-radius: 12px; border: 1px solid #e8d5b0;">
          <h2 style="color: #8b6914; text-align: center; letter-spacing: 2px;">GOLDEN HANDS</h2>
          <p style="color: #6b5b3e; text-align: center; font-style: italic;">Reiki Healing & Energy Wellness</p>
          <hr style="border-color: #e8d5b0; margin: 24px 0;" />
          <p style="color: #3d2b0f; line-height: 1.8;">Dear ${name},</p>
          <p style="color: #3d2b0f; line-height: 1.8;">Thank you for reaching out to Golden Hands. I have received your message and will get back to you within 24 hours.</p>
          <p style="color: #3d2b0f; line-height: 1.8;">I look forward to supporting you on your healing journey.</p>
          <p style="color: #3d2b0f; line-height: 1.8; margin-top: 28px;">With light and love,<br /><strong style="color: #8b6914;">Vibha</strong><br /><em>Golden Hands Reiki</em></p>
        </div>
      `,
    };

    await transporter.sendMail(mailToVibha);
    await transporter.sendMail(mailToUser);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error("FULL ERROR:", err);
    console.error("STACK:", err.stack);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'Golden Hands API' }));

app.listen(PORT, () => console.log(`✨ Golden Hands server running on port ${PORT}`));
console.log("DB PORT:", process.env.DATABASE_URL);
