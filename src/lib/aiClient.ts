// Streaming client for the ai-agent edge function (Anthropic Claude SSE format).
const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-agent`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type ChatRole = "user" | "assistant";
export type ChatMsg = { role: ChatRole; content: string };
export type AgentMode = "help" | "guide" | "matcher" | "reviewer";

export async function streamAgent({
  messages,
  mode,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMsg[];
  mode: AgentMode;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError?: (err: string) => void;
}) {
  try {
    const resp = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({ messages, mode }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        onError?.("Too many requests — please slow down a moment.");
      } else if (resp.status === 401) {
        onError?.("AI agent not configured. Please set ANTHROPIC_API_KEY.");
      } else {
        onError?.("AI agent unavailable right now.");
      }
      onDone();
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let done = false;
    // Anthropic SSE sends "event: <type>" lines before "data: <json>" lines.
    let currentEvent = "";

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);

        if (line.trim() === "") {
          currentEvent = "";
          continue;
        }

        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
          continue;
        }

        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();

        try {
          const parsed = JSON.parse(json);

          // Anthropic streaming: content_block_delta carries text chunks
          if (
            parsed.type === "content_block_delta" &&
            parsed.delta?.type === "text_delta" &&
            parsed.delta?.text
          ) {
            onDelta(parsed.delta.text as string);
            continue;
          }

          // Anthropic streaming: message_stop signals end of stream
          if (parsed.type === "message_stop") {
            done = true;
            break;
          }
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError?.(e instanceof Error ? e.message : "Network error");
    onDone();
  }
}
