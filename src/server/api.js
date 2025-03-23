import express from 'express';
import cors from 'cors';
import { sendContactFormEmail } from './emailService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.name || !formData.title || !formData.message || !formData.subject) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    // Send email
    const result = await sendContactFormEmail(formData);
    
    res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process form submission' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 