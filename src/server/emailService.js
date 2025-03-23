import nodemailer from 'nodemailer';

// Configure email transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codinggeneraltutorials@gmail.com',
    pass: 'uznp nyzi zkuo nolv' // App password for SMTP
  }
});

/**
 * Sends an email with the contact form data
 * @param {Object} formData - The contact form data
 * @param {string} formData.name - The name of the sender
 * @param {string} formData.email - The email of the recipient
 * @param {string} formData.title - The title from the form
 * @param {string} formData.message - The message content
 * @param {string} formData.subject - The formatted subject line
 * @returns {Promise} - Promise resolving to the email sending result
 */
export async function sendContactFormEmail(formData) {
  const { name, email, title, message, subject } = formData;

  const mailOptions = {
    from: '"WishOne App" <codinggeneraltutorials@gmail.com>',
    to: 'codinggeneraltutorials@gmail.com',
    subject: subject,
    text: 
`From: ${name}
Title: ${title}

${message}`,
    html: `
      <h2>${subject}</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Form Type:</strong> ${subject.split(' - ')[0]}</p>
      <p><strong>Title:</strong> ${title}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 