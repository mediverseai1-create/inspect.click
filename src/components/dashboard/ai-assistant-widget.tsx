"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function AiAssistantWidget() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const ask = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.comingSoon) setComingSoon(true);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply ?? data.error ?? "Something went wrong." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Couldn't reach the AI Assistant. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6.5">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[15px] font-semibold">AI Inspection Assistant</h3>
        {comingSoon && <span className="mono text-[10.5px] px-2 py-1 rounded-md bg-paper-dim text-ink-55">COMING SOON</span>}
      </div>

      {messages.length === 0 && (
        <p className="text-[13.5px] text-ink-55 mb-4">Ask about open findings, overdue actions, or recent inspections.</p>
      )}

      <div className="flex flex-col gap-2.5 mb-4 max-h-[260px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[90%] text-[13.5px] leading-relaxed px-3.5 py-2.5 rounded-2xl ${
              m.role === "user" ? "self-end bg-ink text-paper rounded-br-[5px]" : "self-start bg-paper-dim text-ink rounded-bl-[5px]"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2.5">
        <Input
          placeholder="Which findings are most urgent?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), ask())}
          disabled={loading}
        />
        <Button type="button" variant="ghost" className="px-4 py-2 text-[13px]" onClick={ask} disabled={loading || !question.trim()}>
          {loading ? "Asking…" : "Ask"}
        </Button>
      </div>
    </Card>
  );
}
