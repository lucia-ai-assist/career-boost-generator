import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, industry, experienceLevel, skills, userId } = await req.json();

    // Validate input
    if (!jobTitle || !industry || !experienceLevel || !skills) {
      throw new Error('Missing required fields');
    }

    const prompt = `Create 5 professional resume bullet points for a ${jobTitle} position in the ${industry} industry with ${experienceLevel} years of experience. Focus on these skills: ${skills}. Make the bullet points action-oriented, quantifiable, and highlight achievements. Format them as a JSON array of strings.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer who creates compelling bullet points. Return only the bullet points as a JSON array of strings, with no additional commentary.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await openAIResponse.json();
    console.log('OpenAI Response:', data);

    let bulletPoints;
    try {
      // Parse the content as JSON if it's a string, or use it directly if it's already an array
      bulletPoints = typeof data.choices[0].message.content === 'string' 
        ? JSON.parse(data.choices[0].message.content)
        : data.choices[0].message.content;
    } catch (e) {
      console.error('Error parsing bullet points:', e);
      // If parsing fails, split by newlines and clean up
      bulletPoints = data.choices[0].message.content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[•-]\s*/, '').trim());
    }

    // Store in database if userId is provided
    if (userId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error: insertError } = await supabaseClient
        .from('bullet_points')
        .insert({
          user_id: userId,
          job_title: jobTitle,
          industry: industry,
          experience_level: experienceLevel,
          skills: skills,
          generated_points: bulletPoints,
        });

      if (insertError) {
        console.error('Error inserting bullet points:', insertError);
        throw new Error('Failed to save bullet points');
      }
    }

    return new Response(JSON.stringify({ bulletPoints }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-bullet-points function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});