import { Case } from '../types';
import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const refineSymptoms = async (rawText: string): Promise<string> => {
  if (!rawText || rawText.length < 5) return rawText;

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.warn('No active session for API call');
      return rawText;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/refine-symptoms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rawText })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        console.warn('Rate limit reached:', errorData.error);
        return errorData.fallback || rawText;
      }
      throw new Error(errorData.error || 'Failed to refine symptoms');
    }

    const data = await response.json();
    return data.refined || rawText;
  } catch (error) {
    console.error("Gemini Refine Error:", error);
    return rawText;
  }
};

export const analyzeCaseForDoctor = async (c: Case): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.warn('No active session for API call');
      return "AI analysis requires authentication.";
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-case`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        specialty: c.specialty,
        symptoms: c.symptoms,
        patientName: c.patientName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        console.warn('Rate limit reached:', errorData.error);
        return errorData.analysis || "AI analysis temporarily unavailable.";
      }
      throw new Error(errorData.error || 'Failed to analyze case');
    }

    const data = await response.json();
    return data.analysis || "AI Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Could not generate AI analysis at this time.";
  }
};