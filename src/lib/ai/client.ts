import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';

export const google = createGoogleGenerativeAI({ apiKey });
export const genAI = new GoogleGenerativeAI(apiKey);
export const model = google('gemini-2.0-flash-lite');