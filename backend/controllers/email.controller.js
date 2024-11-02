const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use app-specific password
  }
});

async function sendProjectNotifications(req, res) {
  const { projectName, projectDescription, userEmail, adminEmail } = req.body;

  try {
    // Send email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
    });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
    });

    res.status(200).json({ message: 'Email notifications sent successfully' });
  } catch (error) {
    console.error('Error sending email notifications:', error);
    res.status(500).json({ message: 'Error sending email notifications' });
  }
}

module.exports = {
  sendProjectNotifications
};