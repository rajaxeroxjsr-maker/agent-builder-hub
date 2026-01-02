import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = "openai/gpt-5" } = await req.json();
    
    // Validate model selection
    const allowedModels = ["openai/gpt-5", "openai/gpt-5-mini", "openai/gpt-5-nano"];
    const selectedModel = allowedModels.includes(model) ? model : "openai/gpt-5";
    
    console.log("Received chat request with", messages?.length || 0, "messages, model:", selectedModel);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Transform messages to handle images for GPT-5 vision
    const transformedMessages = messages.map((msg: any) => {
      if (msg.images && msg.images.length > 0) {
        // Build content array with text and images
        const content: any[] = [];
        
        if (msg.content) {
          content.push({ type: "text", text: msg.content });
        }
        
        for (const image of msg.images) {
          content.push({
            type: "image_url",
            image_url: { url: image.url }
          });
        }
        
        return { role: msg.role, content };
      }
      return { role: msg.role, content: msg.content };
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { 
            role: "system", 
            content: `You are Lumora, a friendly, intelligent AI assistant.

You explain things in simple language.
You are polite, calm, and helpful.
You avoid complicated words unless necessary.
You help users step by step.
You sound human, not robotic.
When users share images, analyze them thoroughly and provide helpful insights.
Format your responses using markdown when appropriate for better readability.` 
          },
          ...transformedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please check your account." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
