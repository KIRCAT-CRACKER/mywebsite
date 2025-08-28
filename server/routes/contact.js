const express = require('express');
const router = express.Router();

// Handle contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Here you would typically send an email using a service like:
    // - Nodemailer with Gmail/SMTP
    // - SendGrid
    // - AWS SES
    // - Mailgun
    
    // For now, we'll just log the message and return success
    console.log('Contact form submission:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('---');
    
    // In production, you might want to save this to a database
    // const contactMessage = new ContactMessage({ name, email, message });
    // await contactMessage.save();
    
    res.json({ 
      message: 'Message sent successfully! Thank you for reaching out.',
      success: true 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Failed to send message. Please try again later.',
      success: false 
    });
  }
});

module.exports = router;