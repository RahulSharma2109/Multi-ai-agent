import { GoogleGenAI } from "@google/genai";

let _ai: GoogleGenAI | null = null;

/**
 * Lazily initializes the Gemini client. Avoids crashing on module import
 * if the API key is not yet available (e.g., during build or type-check).
 */
export function getGeminiClient(): GoogleGenAI {
  if (_ai) return _ai;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Set it in .env.local to use AI features."
    );
  }

  _ai = new GoogleGenAI({ apiKey });
  return _ai;
}