import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowLeft, Home, Mail, MessageCircle, ExternalLink, Loader2, CheckCircle, AlertCircle, HelpCircle, Settings, Calendar, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Define FAQ item type
interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
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
    name: 'App Developer',
    email: 'codinggeneraltutorials@gmail.com',
    message: ''
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: 'App Developer',
    email: 'codinggeneraltutorials@gmail.com',
    message: ''
  });

  // FAQ data with icons
  const faqItems: FAQItem[] = [
    {
      question: "How do I add a new birthday?",
      answer: "To add a new birthday, navigate to the home screen and tap the '+' button. Fill in the name, date, and relationship details, then tap 'Save'.",
      category: "Birthdays",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      question: "How do I edit a birthday?",
      answer: "To edit a birthday, find it in your list, tap on it, and select the 'Edit' option. Make your changes and tap 'Save'.",
      category: "Birthdays",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      question: "How do I change the app theme?",
      answer: "To change the app theme, go to your profile page and tap 'Settings'. Under the 'Appearance' tab, you can select different background gradients or enable dark mode.",
      category: "Appearance",
      icon: <Settings className="h-5 w-5" />
    },
    {
      question: "How do I set up reminders?",
      answer: "To set up reminders, go to Settings > Calendar and select your preferred reminder time (1 day, 3 days, 1 week, etc.) before each birthday.",
      category: "Notifications",
      icon: <Bell className="h-5 w-5" />
    },
    {
      question: "How do I sync with Google Calendar?",
      answer: "To sync with Google Calendar, go to Settings > Calendar and toggle on 'Google Calendar'. You'll be prompted to authorize the connection.",
      category: "Calendar",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      question: "How do I change my profile picture?",
      answer: "To change your profile picture, go to your profile page and tap on your current picture or the camera icon. You can then select a new image from your device.",
      category: "Profile",
      icon: <User className="h-5 w-5" />
    },
    {
      question: "What happens if I lose internet connection?",
      answer: "WishOne works offline! Your data is stored locally on your device, and it will sync automatically when you reconnect to the internet.",
      category: "General",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "How do I sign out?",
      answer: "To sign out, go to your profile page and tap the 'Sign Out' button at the bottom of the screen.",
      category: "Account",
      icon: <User className="h-5 w-5" />
    },
    {
      question: "Is my data secure?",
      answer: "Yes, your data is secure. We use encryption for all data transfers and storage. Your personal information is never shared with third parties.",
      category: "Privacy",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Account > Privacy Settings, and select 'Delete Account'. This action cannot be undone.",
      category: "Account",
      icon: <User className="h-5 w-5" />
    }
  ];

  // Get all unique categories with their icons
  const categoriesWithIcons = Array.from(
    new Set(faqItems.map(item => item.category))
  ).map(category => {
    const icon = faqItems.find(item => item.category === category)?.icon;
    return { name: category, icon };
  });

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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="rounded-full hover:bg-purple-100/50 bg-white/30 backdrop-blur-sm border border-white/40 h-10 w-10 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-purple-700" />
            </button>
            <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full border border-white/40">
              <HelpCircle className="h-6 w-6" />
              Help Center
            </h1>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="rounded-full hover:bg-purple-100/50 bg-white/30 backdrop-blur-sm border border-white/40 h-10 w-10 flex items-center justify-center"
          >
            <Home className="h-5 w-5 text-purple-700" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {categoriesWithIcons.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === category.name
                    ? 'bg-purple-600/90 text-white shadow-lg'
                    : 'bg-white/60 backdrop-blur-sm text-purple-800 border border-white/40 shadow-md hover:bg-white/80'
                }`}
              >
                <span className={`${activeCategory === category.name ? 'text-white' : 'text-purple-600'}`}>
                  {category.icon}
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="mb-8">
          <AnimatePresence>
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg overflow-hidden"
                  >
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100/70 p-2 rounded-full text-purple-600">
                          {item.icon}
                        </div>
                        <h3 className="font-medium text-purple-800">{item.question}</h3>
                      </div>
                      <div className="bg-white/70 rounded-full p-1">
                        {expandedIndex === index ? (
                          <ChevronUp className="h-5 w-5 text-purple-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-gray-700 border-t border-white/40 pt-3 bg-white/30">
                            <p className="mb-2">{item.answer}</p>
                            <div className="text-xs text-purple-600 bg-purple-50/50 px-2 py-1 rounded-full inline-block">
                              {item.category}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg p-8 text-center"
              >
                <div className="bg-purple-100/70 p-4 rounded-full inline-flex mb-4">
                  <HelpCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">No results found</h3>
                <p className="text-gray-600">Try a different search term or category</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg overflow-hidden">
          <div className="p-4 bg-purple-600/90 text-white">
            <h2 className="text-lg font-medium">Still need help?</h2>
          </div>
          
          <AnimatePresence mode="wait">
            {!showContactForm ? (
              <motion.div
                key="contact-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <p className="text-gray-700 mb-6">
                  Can't find what you're looking for? Contact our support team.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/70 text-purple-700 border border-white/40 shadow-md hover:bg-white/90 transition-all"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Contact Form</span>
                  </button>
                  
                  <a
                    href="mailto:support@wishone.app"
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/70 text-purple-700 border border-white/40 shadow-md hover:bg-white/90 transition-all"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email Support</span>
                  </a>
                  
                  <a
                    href="https://docs.wishone.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/70 text-purple-700 border border-white/40 shadow-md hover:bg-white/90 transition-all"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Documentation</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                {/* Form Status Messages */}
                <AnimatePresence>
                  {formState.isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 bg-green-100/70 text-green-700 rounded-xl flex items-center border border-green-200/70"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Thank you! Your message has been sent successfully.</span>
                    </motion.div>
                  )}
                  
                  {formState.isError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 bg-red-100/70 text-red-700 rounded-xl flex items-center border border-red-200/70"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>{formState.errorMessage || 'There was an error sending your message. Please try again.'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      disabled={formState.isSubmitting || formState.isSuccess}
                      className={`w-full p-3 rounded-xl bg-white/50 backdrop-blur-sm border ${
                        formErrors.name ? 'border-red-300 ring-2 ring-red-300' : 'border-white/40'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Your name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      disabled={formState.isSubmitting || formState.isSuccess}
                      className={`w-full p-3 rounded-xl bg-white/50 backdrop-blur-sm border ${
                        formErrors.email ? 'border-red-300 ring-2 ring-red-300' : 'border-white/40'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-purple-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      disabled={formState.isSubmitting || formState.isSuccess}
                      rows={4}
                      className={`w-full p-3 rounded-xl bg-white/50 backdrop-blur-sm border ${
                        formErrors.message ? 'border-red-300 ring-2 ring-red-300' : 'border-white/40'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="How can we help you?"
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-2">
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
                      className="flex-1 py-2 px-4 rounded-xl bg-white/70 text-gray-700 border border-white/40 shadow-md hover:bg-white/90 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formState.isSubmitting || formState.isSuccess}
                      className="flex-1 py-2 px-4 rounded-xl bg-purple-600/90 text-white shadow-md hover:bg-purple-700 transition-all disabled:opacity-50 flex justify-center items-center"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 