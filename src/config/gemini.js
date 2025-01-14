import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export const getGeminiModel = async () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
};
