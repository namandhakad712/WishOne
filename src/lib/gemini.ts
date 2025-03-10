import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see .env.local)
const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyBP8O7uq6C6Ua84ErWiyzzt-wtjP2mUmIY";

// Initialize the Gemini API
export const genAI = new GoogleGenerativeAI(apiKey);

// Function to generate a response using Gemini
export async function generateResponse(prompt: string) {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm having trouble connecting to my AI services right now. Please try again later.";
  }
}

// Function to analyze an image using Gemini
export async function analyzeImage(imageData: string, prompt: string) {
  try {
    // For multimodal input (text + image), use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Convert base64 image data to a GoogleGenerativeAI.Part
    const imageParts = [
      {
        inlineData: {
          data: imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
          mimeType: imageData.includes("image/png")
            ? "image/png"
            : "image/jpeg",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "I'm having trouble analyzing this image right now. Please try again later.";
  }
}
