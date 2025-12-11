import { GoogleGenerativeAI } from "@google/generative-ai";
import { Case } from '../types';

// Initialize Gemini Client
// NOTE: In a production app, never expose API keys on the client. 
// This is for demonstration purposes as requested by the persona guidance.
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const refineSymptoms = async (rawText: string): Promise<string> => {
  if (!rawText || rawText.length < 5) return rawText;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(
      `You are a helpful medical assistant. Rewrite the following patient symptom description to be more clinical, clear, and concise for a doctor to read. Maintain the original meaning. \n\nPatient Input: "${rawText}"`
    );
    const response = await result.response;
    return response.text() || rawText;
  } catch (error) {
    console.error("Gemini Refine Error:", error);
    return rawText; // Fallback to original
  }
};

export const analyzeCaseForDoctor = async (c: Case): Promise<string> => {
  try {
    const prompt = `
      Act as a senior medical consultant. Analyze the following case data and provide a brief summary of potential differential diagnoses to consider.
      Do NOT provide a final diagnosis, just areas for the doctor to investigate.

      Specialty: ${c.specialty}
      Symptoms: ${c.symptoms}
      Patient Name: ${c.patientName}
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text() || "AI Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Could not generate AI analysis at this time.";
  }
};