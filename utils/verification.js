import nodemailer from 'nodemailer';

// Generate a 6-digit numeric verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCodeEmail = async (email, code) => {
  try {
    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Jays Alimi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `<p>Your verification code is: <strong>${code}</strong></p>
             <p>This code will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


export default { generateVerificationCode, sendVerificationCodeEmail };