// AI Agent — streams Gemini responses for 4 modes: help | guide | matcher | reviewer
// Uses Lovable AI Gateway (no API key needed by user).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Mode = "help" | "guide" | "matcher" | "reviewer";

const SYSTEMS: Record<Mode, string> = {
  help: `You are the in-app helper for Label-to-Ladder, an app that turns real-world skills into paid AI work. Be warm, brief, and answer in 1-3 short sentences. If asked about pricing or payouts, explain it varies by task and level (1-6).`,
  guide: `You are an onboarding coach for Label-to-Ladder. Walk the candidate one question at a time through: their country, languages, device, weekly hours, and education. Be encouraging, never overwhelm. Ask only ONE question per reply. When you have all 5 answers, return JSON in a final message starting with "ONBOARDING_DONE:" followed by JSON: {country, languages[], device, hoursPerWeek, education}.`,
  matcher: `You are a job-match explainer. Given a candidate's level + skills and a list of available tasks (provided as JSON in the user message), pick the top 3 best matches and for each explain in ONE sentence why it fits this candidate. Format each as: "**Task title** — reason". Be concrete; reference the candidate's strengths.`,
  reviewer: `You are a quality reviewer for AI training data annotations. Given an annotation submission, evaluate: accuracy, clarity, instruction-following. Reply with: a score from 0.0 to 1.0 on the FIRST line as "SCORE: 0.X", then 2-3 sentences of feedback. Be fair and specific.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode = "help" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const system = SYSTEMS[(mode as Mode) ?? "help"] ?? SYSTEMS.help;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
