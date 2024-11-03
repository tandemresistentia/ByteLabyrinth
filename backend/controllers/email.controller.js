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

// Common styles that will be reused in both templates
const baseEmailTemplate = (content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ByteLabyrinth Notification</title>
    </head>
    <body style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    ">
      <div style="
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      ">
        ${content}
        <!-- Footer -->
        <div style="
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #eee;
        ">
          <p style="
            margin: 0;
            color: #666;
            font-size: 14px;
          ">© ${new Date().getFullYear()} ByteLabyrinth. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

// User Email Template
const userMailOptions = {
  from: {
    name: 'ByteLabyrinth',
    address: process.env.EMAIL_USER
  },
  to: userEmail,
  subject: 'Your Project Has Been Created',
  html: baseEmailTemplate(`
    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #4a90e2 0%, #2c5282 100%);
      color: white;
      padding: 20px;
      text-align: center;
    ">
      <h1 style="
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      ">Project Created Successfully! 🎉</h1>
    </div>

    <!-- Content -->
    <div style="padding: 20px;">
      <p style="
        font-size: 16px;
        color: #666;
        margin-bottom: 20px;
      ">Your project "<span style="color: #4a90e2; font-weight: bold;">${projectName}</span>" has been created successfully!</p>

      <div style="
        background-color: #f8f9fa;
        border-left: 4px solid #4a90e2;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 0 4px 4px 0;
      ">
        <h3 style="
          color: #333;
          margin: 0 0 15px 0;
          font-size: 18px;
        ">Project Details</h3>

        <div style="margin-bottom: 10px;">
          <strong style="color: #4a90e2;">Name:</strong>
          <span style="color: #333;">${projectName}</span>
        </div>

        <div style="margin-bottom: 10px;">
          <strong style="color: #4a90e2;">Description:</strong>
          <span style="color: #333;">${projectDescription}</span>
        </div>
      </div>

      <div style="
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
      ">
        <p style="
          margin: 0;
          color: #666;
        ">You can view and manage your project in your dashboard.</p>
        
        <a href="https://bytelabyrinth-production.up.railway.app/dashboard" style="
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #4a90e2;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        ">Go to Dashboard</a>
      </div>
    </div>
  `)
};

// Admin Email Template
const adminMailOptions = {
  from: {
    name: 'ByteLabyrinth',
    address: process.env.EMAIL_USER
  },
  to: adminEmail,
  subject: 'New Project Created',
  html: baseEmailTemplate(`
    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
      color: white;
      padding: 20px;
      text-align: center;
    ">
      <h1 style="
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      ">New Project Notification</h1>
    </div>

    <!-- Content -->
    <div style="padding: 20px;">
      <p style="
        font-size: 16px;
        color: #666;
        margin-bottom: 20px;
      ">A new project has been created by <span style="color: #4a90e2; font-weight: bold;">${userEmail}</span></p>

      <div style="
        background-color: #f8f9fa;
        border-left: 4px solid #2c5282;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 0 4px 4px 0;
      ">
        <h3 style="
          color: #333;
          margin: 0 0 15px 0;
          font-size: 18px;
        ">Project Details</h3>

        <div style="margin-bottom: 10px;">
          <strong style="color: #2c5282;">Name:</strong>
          <span style="color: #333;">${projectName}</span>
        </div>

        <div style="margin-bottom: 10px;">
          <strong style="color: #2c5282;">Description:</strong>
          <span style="color: #333;">${projectDescription}</span>
        </div>
      </div>

      <div style="
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
      ">
        <p style="
          margin: 0;
          color: #666;
        ">Please review the new project in the admin dashboard.</p>
        
        <a href="https://bytelabyrinth-production.up.railway.app/dashboard" style="
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #2c5282;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        ">Review Project</a>
      </div>
    </div>
  `)
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