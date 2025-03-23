import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomTabBar from "@/components/BottomTabBar";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-sm bg-white/70 border-b border-purple-100">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-3 p-2 rounded-full hover:bg-purple-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-purple-700" />
            </button>
            <h1 className="text-2xl font-bold text-purple-900">Privacy Policy</h1>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 w-full p-4 sm:p-6">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 p-6 prose prose-purple max-w-none">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">WishOne Privacy Policy</h2>
              <p className="text-gray-700 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">1. Introduction</h3>
                <p>Welcome to WishOne! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
                <p>Please read this Privacy Policy carefully. By using WishOne, you agree to the collection and use of information in accordance with this policy.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">2. Information We Collect</h3>
                <p>We may collect several types of information, including:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Personal Information</strong>: Name, email address, and profile information you provide.</li>
                  <li><strong>Birthday Information</strong>: Dates and details you add about your contacts.</li>
                  <li><strong>Usage Data</strong>: How you interact with the app, features you use, and preferences.</li>
                  <li><strong>Device Information</strong>: Device type, operating system, and browser information.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">3. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your requests and respond to your inquiries</li>
                  <li>Send notifications about birthdays and events</li>
                  <li>Personalize your experience and content</li>
                  <li>Analyze usage patterns to enhance our application</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">4. AI Features and Data</h3>
                <p>WishOne uses artificial intelligence to enhance your experience:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Content you share with our AI assistant may be processed by Google's Gemini API</li>
                  <li>We do not permanently store the content of your conversations with the AI</li>
                  <li>Your conversations help improve the AI's responses but are not linked to your identity</li>
                </ul>
                <p>You can learn more about Google's AI principles and data handling at <a href="https://ai.google/responsibility/" className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">https://ai.google/responsibility/</a></p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">5. Information Sharing</h3>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following cases:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>With service providers who help us operate our application</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">6. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Restricted access to personal information</li>
                </ul>
                <p>However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">7. Your Privacy Rights</h3>
                <p>Depending on your location, you may have rights regarding your personal information:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your personal information</li>
                  <li>Restrict or object to processing</li>
                  <li>Data portability</li>
                </ul>
                <p>To exercise these rights, please contact us using the information in the "Contact Us" section.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">8. Children's Privacy</h3>
                <p>WishOne is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">9. Changes to This Privacy Policy</h3>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                <p>We encourage you to review this Privacy Policy periodically for any changes.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">10. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p className="font-medium">privacy@wishone.app</p>
              </section>
            </div>
          </div>
        </ScrollArea>

        <BottomTabBar
          activeTab="home"
          onHomeClick={() => navigate("/")}
          onChatClick={() => navigate("/chat")}
          onProfileClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 