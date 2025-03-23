import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomTabBar from "@/components/BottomTabBar";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsConditionsPage = () => {
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
            <h1 className="text-2xl font-bold text-purple-900">Terms and Conditions</h1>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 w-full p-4 sm:p-6">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 p-6 prose prose-purple max-w-none">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">WishOne Terms and Conditions</h2>
              <p className="text-gray-700 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">1. Introduction</h3>
                <p>Welcome to WishOne! These Terms and Conditions govern your use of the WishOne application and services (the "Service"). By using our Service, you agree to these terms. Please read them carefully.</p>
                <p>WishOne is a personal assistant application designed to help you remember important dates, create personalized messages, and provide AI-powered conversation.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">2. Using Our Service</h3>
                <p>When using WishOne, you agree to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide accurate information about yourself and others you add to the Service</li>
                  <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
                  <li>Not use the Service in any way that could harm the Service or impair others' use of the Service</li>
                  <li>Not attempt to gain unauthorized access to any part of the Service</li>
                </ul>
                <p>We reserve the right to terminate or restrict your access to the Service if you violate these Terms.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">3. Your Content</h3>
                <p>Our Service allows you to store and share various content such as:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Personal information (such as birthdays, relationships, etc.)</li>
                  <li>Messages and conversations</li>
                  <li>Images and other media</li>
                </ul>
                <p>You retain all rights to your content. By uploading or otherwise providing content to our Service, you grant us a license to use, store, and display that content in connection with providing the Service to you.</p>
                <p>You are solely responsible for the content you provide, and you represent that you have all necessary rights to that content.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">4. Privacy and Data</h3>
                <p>Your privacy matters to us. Our use of your personal information is governed by our <a href="/privacy" className="text-purple-600 hover:text-purple-800 underline">Privacy Policy</a>.</p>
                <p>Please note that some features of WishOne may require integration with third-party services (such as Google's Gemini AI). Your use of these integrations may be subject to additional terms and privacy policies.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">5. AI Features</h3>
                <p>WishOne uses artificial intelligence to enhance your experience. Please be aware that:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>AI-generated content may not always be accurate or appropriate</li>
                  <li>You should review any AI-generated content before using it</li>
                  <li>We are not responsible for decisions you make based on AI-generated suggestions</li>
                </ul>
                <p>Our AI features are designed to assist and inspire you, not to replace human judgment.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">6. Changes to Our Service</h3>
                <p>We are constantly improving our Service. As such, we may:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Add or remove features or functionality</li>
                  <li>Suspend or discontinue the Service entirely</li>
                  <li>Update the Service to address security concerns or improve performance</li>
                </ul>
                <p>We will make reasonable efforts to notify you of significant changes to the Service.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">7. Disclaimer of Warranties</h3>
                <p>WishOne is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>The Service will always be available or error-free</li>
                  <li>Any errors or defects will be corrected</li>
                  <li>The Service is free of viruses or other harmful components</li>
                </ul>
                <p>To the fullest extent permitted by law, we disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">8. Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or other intangible losses, resulting from:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Your use or inability to use the Service</li>
                  <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                  <li>Any interruption or cessation of transmission to or from the Service</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">9. Changes to Terms</h3>
                <p>We may modify these Terms at any time. If we make changes, we will provide notice by:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Posting the updated Terms on our website</li>
                  <li>Updating the "Last Updated" date at the top of these Terms</li>
                  <li>Providing notification within the Service</li>
                </ul>
                <p>Your continued use of the Service after any changes to the Terms constitutes your acceptance of the new Terms.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">10. Contact Us</h3>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p className="font-medium">support@wishone.app</p>
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

export default TermsConditionsPage; 