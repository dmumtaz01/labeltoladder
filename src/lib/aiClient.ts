// Streaming client for the ai-agent edge function.
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
      } else if (resp.status === 402) {
        onError?.("AI credits exhausted. Add credits in workspace settings.");
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

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (c) onDelta(c);
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
