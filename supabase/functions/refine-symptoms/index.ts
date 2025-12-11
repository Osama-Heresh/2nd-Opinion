import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Simple hash function for caching
async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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
          fallback: null 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { rawText } = await req.json();

    if (!rawText || rawText.length < 5) {
      return new Response(
        JSON.stringify({ refined: rawText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const textHash = await hashText(rawText);
    const { data: cached } = await supabaseClient
      .from('symptom_cache')
      .select('refined_text, usage_count')
      .eq('hash', textHash)
      .maybeSingle();

    if (cached) {
      // Update usage count
      await supabaseClient
        .from('symptom_cache')
        .update({ 
          usage_count: cached.usage_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('hash', textHash);

      return new Response(
        JSON.stringify({ refined: cached.refined_text, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Gemini API
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured', fallback: rawText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent(
      `You are a helpful medical assistant. Rewrite the following patient symptom description to be more clinical, clear, and concise for a doctor to read. Maintain the original meaning. Keep it under 200 words.\n\nPatient Input: "${rawText}"`
    );
    
    const response = await result.response;
    const refinedText = response.text() || rawText;

    // Estimate tokens used (rough estimate: 1 token ≈ 4 characters)
    const estimatedTokens = Math.ceil((rawText.length + refinedText.length) / 4);

    // Store in cache
    await supabaseClient.from('symptom_cache').insert({
      raw_text: rawText,
      refined_text: refinedText,
      hash: textHash
    });

    // Track usage
    await supabaseClient.rpc('increment_api_usage', { tokens: estimatedTokens });

    return new Response(
      JSON.stringify({ refined: refinedText, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: null
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});