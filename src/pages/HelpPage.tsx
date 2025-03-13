import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowLeft, Home, Mail, MessageSquare, ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define FAQ item type
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Define form state type
interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: "How do I add a new birthday?",
      answer: "To add a new birthday, navigate to the home screen and tap the '+' button. Fill in the name, date, and relationship details, then tap 'Save'.",
      category: "Birthdays"
    },
    {
      question: "How do I edit a birthday?",
      answer: "To edit a birthday, find it in your list, tap on it, and select the 'Edit' option. Make your changes and tap 'Save'.",
      category: "Birthdays"
    },
    {
      question: "How do I change the app theme?",
      answer: "To change the app theme, go to your profile page and tap 'Settings'. Under the 'Appearance' tab, you can select different background gradients or enable dark mode.",
      category: "Appearance"
    },
    {
      question: "How do I set up reminders?",
      answer: "To set up reminders, go to Settings > Calendar and select your preferred reminder time (1 day, 3 days, 1 week, etc.) before each birthday.",
      category: "Notifications"
    },
    {
      question: "How do I sync with Google Calendar?",
      answer: "To sync with Google Calendar, go to Settings > Calendar and toggle on 'Google Calendar'. You'll be prompted to authorize the connection.",
      category: "Calendar"
    },
    {
      question: "How do I change my profile picture?",
      answer: "To change your profile picture, go to your profile page and tap on your current picture or the camera icon. You can then select a new image from your device.",
      category: "Profile"
    },
    {
      question: "What happens if I lose internet connection?",
      answer: "WishOne works offline! Your data is stored locally on your device, and it will sync automatically when you reconnect to the internet.",
      category: "General"
    },
    {
      question: "How do I sign out?",
      answer: "To sign out, go to your profile page and tap the 'Sign Out' button at the bottom of the screen.",
      category: "Account"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, your data is secure. We use encryption for all data transfers and storage. Your personal information is never shared with third parties.",
      category: "Privacy"
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Account > Privacy Settings, and select 'Delete Account'. This action cannot be undone.",
      category: "Account"
    }
  ];

  // Get all unique categories
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  // Filter FAQ items based on search query and active category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Toggle FAQ item expansion
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
    setExpandedIndex(null);
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      message: ''
    };

    // Validate name
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (contactForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate message
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (contactForm.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset form state
    setFormState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      errorMessage: ''
    });
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set submitting state
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send this data to your backend
      // Example API call:
      /*
      const response = await fetch('https://api.wishone.app/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      */
      
      // Log form data (for development)
      console.log('Contact form submitted:', contactForm);
      
      // Set success state
      setFormState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        errorMessage: ''
      });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setContactForm({ name: '', email: '', message: '' });
        setFormState(prev => ({ ...prev, isSuccess: false }));
        setShowContactForm(false);
      }, 2000);
      
    } catch (error) {
      // Set error state
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#e8eeeb] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-[#f0f4f1] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
          >
            <ArrowLeft className="h-5 w-5 text-[#5a7d7c]" />
          </button>
          <h1 className="text-2xl font-serif text-[#5a7d7c]">Help Center</h1>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[#f0f4f1] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
        >
          <Home className="h-5 w-5 text-[#5a7d7c]" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-[#5a7d7c] focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#5a7d7c] text-white shadow-[3px_3px_6px_rgba(0,0,0,0.1)]'
                  : 'bg-white text-[#5a7d7c] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="flex-1 px-4 pb-6">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((item, index) => (
            <div 
              key={index} 
              className="mb-4 rounded-xl bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] overflow-hidden transition-all duration-300"
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <h3 className="font-medium text-[#5a7d7c]">{item.question}</h3>
                {expandedIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#5a7d7c]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#5a7d7c]" />
                )}
              </div>
              {expandedIndex === index && (
                <div className="px-4 pb-4 text-gray-600 border-t border-gray-100">
                  <p className="mt-2">{item.answer}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    Category: {item.category}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p>No results found</p>
            <p className="text-sm mt-2">Try a different search term or category</p>
          </div>
        )}
      </div>

      {/* Contact Support Section */}
      <div className="px-4 pb-20">
        <div className="rounded-xl bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] overflow-hidden">
          <div className="p-4 bg-[#5a7d7c] text-white">
            <h2 className="text-lg font-medium">Still need help?</h2>
          </div>
          
          {!showContactForm ? (
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Contact our support team.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white text-[#5a7d7c] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Contact Form</span>
                </button>
                
                <a
                  href="mailto:support@wishone.app"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white text-[#5a7d7c] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all"
                >
                  <Mail className="h-5 w-5" />
                  <span>Email Support</span>
                </a>
                
                <a
                  href="https://docs.wishone.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white text-[#5a7d7c] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all md:col-span-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Documentation</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Form Status Messages */}
              {formState.isSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}
              
              {formState.isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{formState.errorMessage || 'There was an error sending your message. Please try again.'}</span>
                </div>
              )}
              
              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    disabled={formState.isSubmitting || formState.isSuccess}
                    className={`w-full p-3 rounded-lg bg-[#f0f4f1] border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-[#5a7d7c] focus:ring-opacity-50 ${
                      formErrors.name ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    disabled={formState.isSubmitting || formState.isSuccess}
                    className={`w-full p-3 rounded-lg bg-[#f0f4f1] border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-[#5a7d7c] focus:ring-opacity-50 ${
                      formErrors.email ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    disabled={formState.isSubmitting || formState.isSuccess}
                    rows={4}
                    className={`w-full p-3 rounded-lg bg-[#f0f4f1] border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-[#5a7d7c] focus:ring-opacity-50 ${
                      formErrors.message ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowContactForm(false);
                      setFormErrors({ name: '', email: '', message: '' });
                      setFormState({
                        isSubmitting: false,
                        isSuccess: false,
                        isError: false,
                        errorMessage: ''
                      });
                    }}
                    disabled={formState.isSubmitting}
                    className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formState.isSubmitting || formState.isSuccess}
                    className="flex-1 py-2 px-4 rounded-lg bg-[#5a7d7c] text-white shadow-[3px_3px_6px_rgba(0,0,0,0.1)] hover:bg-[#4a6d6c] transition-all disabled:opacity-50 flex justify-center items-center"
                  >
                    {formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 