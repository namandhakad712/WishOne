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
              <p className="text-gray-700 mb-6">Last Updated: March 24, 2025</p>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">1. Hey There!</h3>
                <p>Welcome to WishOne! We're thrilled you're here. This app is all about spreading good vibes and keeping things simple. We're not into collecting your data or sneaking around behind your back—this policy is just to let you know how open and honest we are.</p>
                <p>By using WishOne, you're joining a little project built with an open mind and a big heart. Let's keep it fun and free!</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">2. We Don't Collect Anything</h3>
                <p>Seriously, we don't grab any data from you. Here's what that means:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>No names, emails, or personal details.</li>
                  <li>No birthday info or contact lists.</li>
                  <li>No tracking how you use the app or what you click on.</li>
                  <li>No device info, like what phone you've got or what system it's running.</li>
                </ul>
                <p>You use WishOne, and that's it—nothing leaves your hands or sneaks back to us.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">3. How We Use... Well, Nothing!</h3>
                <p>Since we don't collect any info, we don't use it either. The app's here to help you enjoy it however you like:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>No sneaky notifications (unless you ask for something specific).</li>
                  <li>No "personalized" stuff based on data—because we don't have any!</li>
                  <li>No analyzing you. Just a clean, open experience.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">4. AI? Only If You Want It</h3>
                <p>WishOne might let you chat with an AI buddy (powered by Google's Gemini API) if we add that feature. Here's the deal:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>If you type something to the AI, it processes it right then and there.</li>
                  <li>We don't save your chats. They're gone when you're done.</li>
                  <li>Nothing's tied to you—no names, no traces.</li>
                  <li>The AI might get smarter from what people say, but it's all anonymous.</li>
                </ul>
                <p>Want to know more? Check out Google's AI vibe at <a href="https://ai.google/responsibility/" className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">ai.google/responsibility/</a>.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">5. Sharing? Nope, Not Happening</h3>
                <p>We've got nothing to share because we don't take anything. No selling, no trading, no passing stuff along to anyone—ever. Not to service providers, not to anyone. It's just you and the app.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">6. Security? It's Chill</h3>
                <p>Since we're not collecting or storing anything, there's no data to protect. No vaults, no locks—just an open app doing its thing. You're in control of whatever happens on your device.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">7. Your Rights (You've Got Them All!)</h3>
                <p>You're the boss of your info. Since we don't hold anything, there's nothing to access, delete, or change on our end. If you've got questions about your privacy, hit us up anyway—we're happy to chat.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">8. Kids? Everyone's Welcome (But No Data!)</h3>
                <p>WishOne is for everyone, kids included. We don't collect anything from anyone, so no worries about little ones. Parents, you're good—we're not after anyone's info.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">9. Updates to This Policy</h3>
                <p>If we tweak this policy (like if we add a cool feature), we'll pop the new version here and update the date at the top. Check back whenever you feel like it—though honestly, it'll stay pretty simple.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">10. Say Hi Anytime</h3>
                <p>Got questions? Want to talk about WishOne? Contact us at the <strong>"App Support" form in the /help page</strong>.</p>
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