import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check rate limit
    const { data: limitCheck } = await supabaseClient.rpc('check_api_limit');
    
    if (!limitCheck) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily API limit reached. Please try again tomorrow.',
          analysis: 'AI analysis temporarily unavailable due to rate limits.'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { specialty, symptoms, patientName } = await req.json();

    // Call Gemini API
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          analysis: 'AI analysis unavailable - configuration error.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
Act as a senior medical consultant. Analyze the following case data and provide a brief summary of potential differential diagnoses to consider.
Do NOT provide a final diagnosis, just areas for the doctor to investigate. Keep response under 300 words.

Specialty: ${specialty}
Symptoms: ${symptoms}
Patient Name: ${patientName}
`;

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text() || 'AI Analysis unavailable.';

    // Estimate tokens used
    const estimatedTokens = Math.ceil((prompt.length + analysis.length) / 4);

    // Track usage
    await supabaseClient.rpc('increment_api_usage', { tokens: estimatedTokens });

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        analysis: 'Could not generate AI analysis at this time.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});