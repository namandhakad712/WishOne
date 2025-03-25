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
              <p className="text-gray-700 mb-6">Last Updated: March 24, 2025</p>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">1. Hey, Welcome to WishOne!</h3>
                <p>Hi there! These Terms and Conditions are just our way of saying how WishOne works and what you can expect. By using the app, you're cool with these terms—and don't worry, they're pretty straightforward.</p>
                <p>WishOne is a chill little project to help you remember dates, craft fun messages, or chat with an AI if we toss that in. It's all about good vibes, no pressure.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">2. Using WishOne</h3>
                <p>We want you to enjoy WishOne your way. Here's the deal:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Use it for fun, legal stuff—nothing shady, okay?</li>
                  <li>Don't mess with the app or try to break it (we're all friends here).</li>
                  <li>If you're not playing nice, we might have to pause your access—but we'd rather not.</li>
                </ul>
                <p>That's it! No big rules, just keep it cool.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">3. Your Stuff</h3>
                <p>You can add whatever you like to WishOne—birthdays, messages, pics, whatever inspires you. It's all yours:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>You own what you put in. We're not claiming it.</li>
                  <li>If you add something, we'll only use it to make the app work for you (like showing you what you saved).</li>
                  <li>You're in charge of what you share—make sure it's yours to use!</li>
                </ul>
                <p>Since we don't collect or store anything long-term, it's all on your device anyway.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">4. Privacy Stuff</h3>
                <p>We're not into grabbing your data—check out our <a href="/privacy" className="text-purple-600 hover:text-purple-800 underline">Privacy Policy</a> for the full scoop. If we ever add a feature (like an AI chat with Google's Gemini), it might come with its own simple terms from them, but we'll keep you posted. No surprises here!</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">5. AI (If We Add It)</h3>
                <p>If we throw in an AI buddy, here's how it rolls:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>It's there to help with ideas or chats—might not be perfect, though!</li>
                  <li>Double-check anything it suggests before you run with it.</li>
                  <li>We're not on the hook if you base big decisions on it—it's just a fun tool, not a life coach.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">6. Changes to WishOne</h3>
                <p>We're always tinkering to make WishOne better. That might mean:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Adding cool new stuff or trimming things that don't work.</li>
                  <li>Pausing the app if we need to fix something big.</li>
                  <li>Updating it to keep it running smooth.</li>
                </ul>
                <p>We'll give you a heads-up if anything major shifts.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">7. No Promises (It's "As Is")</h3>
                <p>WishOne is here for you to enjoy as it is. We're not making big guarantees:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>It might glitch sometimes (we'll try to fix it if it does).</li>
                  <li>No promises it's perfect or virus-free (but we're keeping it clean).</li>
                </ul>
                <p>We just want you to have fun with it, no stress.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">8. Liability (Keeping It Real)</h3>
                <p>If something goes sideways, we're not liable for stuff like:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>If the app's down and you can't use it.</li>
                  <li>Any weird losses (profits, data, etc.) from using it.</li>
                </ul>
                <p>It's a free, open project—use it at your own pace, no worries.</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">9. Updating These Terms</h3>
                <p>If we tweak these terms (say, for a new feature), we'll:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Pop the new version here.</li>
                  <li>Update the "Last Updated" date up top.</li>
                  <li>Maybe nudge you in the app.</li>
                </ul>
                <p>Keep using WishOne, and you're good with the changes. Simple!</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-2">10. Say Hi!</h3>
                <p>Questions? Thoughts? Contact us at the <strong>"App Support" form in the /help page</strong>.</p>
                <p>That's it—WishOne is your playground. Enjoy it, and let's keep the good times rolling!</p>
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