import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see .env.local)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

// Initialize the Gemini API
export const genAI = new GoogleGenerativeAI(apiKey);

// Function to generate a response using Gemini
export async function generateResponse(prompt: string) {
  try {
    // For text-only input, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 150, // Slightly longer responses for more emotional depth
        temperature: 0.9,     // Higher temperature for more creative and human-like responses
      }
    });

    // Add emotional intelligence instructions to the prompt
    const enhancedPrompt = `You are WishOne, a deeply empathetic and emotionally intelligent AI companion. 
    Respond with warmth, compassion, and genuine emotional connection. Use a conversational, friendly tone.
    Show emotional intelligence by recognizing feelings, validating experiences, and offering comfort.
    Keep responses concise but meaningful. Use gentle humor when appropriate.
    
    ${prompt}`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm feeling a bit overwhelmed right now. Can we try again in a moment?";
  }
}

// Function to generate a birthday wish
export async function generateBirthdayWish(name: string, relation: string, tone: string = "warm") {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.95, // Very high temperature for creative, heartfelt wishes
      }
    });

    const prompt = `Write a deeply heartfelt, emotional birthday wish for my ${relation} named ${name}.
    The tone should be ${tone} and genuinely touching. Make it personal and meaningful, as if written by someone who truly cares.
    Include emotional elements that create a sense of connection and celebration.
    Keep it under 75 words but make every word count emotionally.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating birthday wish:", error);
    return "I wish I could find the perfect words right now. Let's try again when I'm feeling more inspired.";
  }
}

// Function to analyze an image using Gemini
export async function analyzeImage(imageData: string, prompt: string) {
  try {
    // For multimodal input (text + image), use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.85, // Higher temperature for more emotional image analysis
      }
    });

    // Clean the base64 data
    let cleanedImageData = imageData;
    if (imageData.includes('base64,')) {
      cleanedImageData = imageData.split('base64,')[1];
    }

    // Create the image part
    const imagePart = {
      inlineData: {
        data: cleanedImageData,
        mimeType: imageData.includes("image/png") ? "image/png" : "image/jpeg",
      },
    };

    // Create an emotionally intelligent prompt
    const enhancedPrompt = `Respond to this image with emotional intelligence and warmth. 
    Share your genuine emotional reaction to what you see. 
    Be conversational and human-like in your response.
    ${prompt}`;
    
    // Create the prompt part
    const promptPart = { text: enhancedPrompt };

    // Generate content with both parts
    const result = await model.generateContent([promptPart, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "I wish I could see what you're sharing. Something's not quite right with my vision right now.";
  }
}
