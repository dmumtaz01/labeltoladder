import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamAgent, type ChatMsg, type AgentMode } from "@/lib/aiClient";

type Props = {
  mode?: AgentMode;
  greeting?: string;
  inline?: boolean; // render inline (full-screen embedded), not as floating bubble
  systemContext?: string; // extra context appended as first user msg
  onAssistantMessage?: (text: string) => void;
};

export function ChatBubble({
  mode = "help",
  greeting = "Hi! I'm your Ladder guide. Ask me anything about the app, your level, or finding work.",
  inline = false,
  systemContext,
  onAssistantMessage,
}: Props) {
  const [open, setOpen] = useState(inline);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput("");
    const userMsg: ChatMsg = { role: "user", content: value };
    const history = systemContext && messages.length === 0
      ? [{ role: "user" as const, content: systemContext }, userMsg]
      : [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);

    let acc = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await streamAgent({
      messages: history,
      mode,
      onDelta: (chunk) => {
        acc += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      },
      onError: (err) => {
        acc = `_${err}_`;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      },
      onDone: () => {
        setBusy(false);
        onAssistantMessage?.(acc);
      },
    });
  }

  const panel = (
    <div className={inline ? "flex h-full flex-col" : "flex h-[80dvh] max-h-[560px] w-[88vw] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elegant"}>
      {!inline && (
        <header className="flex items-center justify-between gap-2 border-b border-border bg-gradient-hero px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Ladder Assistant</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 transition-smooth hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 px-3 py-3">
        {messages.length === 0 && (
          <div className="rounded-2xl bg-card px-3 py-2.5 text-sm shadow-soft">
            <ReactMarkdown>{greeting}</ReactMarkdown>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-soft ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-foreground">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-border bg-card p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );

  if (inline) return panel;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-40 md:right-auto md:left-1/2 md:translate-x-[calc(210px-380px-16px)]">
          {panel}
        </div>
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-hero text-primary-foreground shadow-elegant transition-spring hover:scale-105 md:right-auto md:left-1/2 md:translate-x-[calc(210px-48px-16px)]"
          aria-label="Open assistant"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
