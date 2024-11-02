const nodemailer = require('nodemailer');

console.log('Email Controller Environment Check:', {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '****' : 'not set'
});

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Changed this line
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, // Enable debugging
  logger: true // Enable logging
});

// Add verification step
async function verifyEmailConfig() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration missing');
  }

  try {
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email verification failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      credentials: {
        user: process.env.EMAIL_USER,
        passLength: process.env.EMAIL_PASSWORD?.length
      }
    });
    throw error;
  }
}

async function sendProjectNotifications(req, res) {
  const { projectName, projectDescription, userEmail, adminEmail } = req.body;

  try {
    // Verify connection first
    await verifyEmailConfig();

    const userMailOptions = {
      from: {
        name: 'ByteLabyrinth',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: 'Your Project Has Been Created',
      html: `
        <h2>Project Created Successfully!</h2>
        <p>Your project "${projectName}" has been created.</p>
        <h3>Project Details:</h3>
        <p><strong>Name:</strong> ${projectName}</p>
        <p><strong>Description:</strong> ${projectDescription}</p>
        <p>You can view your project in your dashboard.</p>
      `
    };

    const adminMailOptions = {
      from: {
        name: 'ByteLabyrinth',
        address: process.env.EMAIL_USER
      },
      to: adminEmail,
      subject: 'New Project Created',
      html: `
        <h2>New Project Notification</h2>
        <p>A new project has been created by ${userEmail}</p>
        <h3>Project Details:</h3>
        <p><strong>Name:</strong> ${projectName}</p>
        <p><strong>Description:</strong> ${projectDescription}</p>
        <p>Please review the new project in the admin dashboard.</p>
      `
    };

    // Send emails with proper error handling
    const results = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log('Emails sent successfully:', {
      userEmail: results[0].messageId,
      adminEmail: results[1].messageId
    });

    res.status(200).json({ 
      message: 'Email notifications sent successfully',
      userEmailId: results[0].messageId,
      adminEmailId: results[1].messageId
    });
  } catch (error) {
    console.error('Email error:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ 
      message: 'Error sending email notifications',
      error: error.message 
    });
  }
}

module.exports = {
  sendProjectNotifications,
  verifyEmailConfig
};