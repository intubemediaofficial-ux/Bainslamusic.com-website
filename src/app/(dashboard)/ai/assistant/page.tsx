"use client";

import { useState } from "react";
import { Bot, Send, Copy, Save, RefreshCw, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Aaj kya kaam pending hai?",
    "DG Mawai ke pending songs batao",
    "Is month ki release list banao",
    "Kaunse agreements missing hain?",
    "Copyright notice draft karo",
    "YouTube SEO title banao - devotional bhajan",
    "Thumbnail prompt banao - Radha Krishna bhajan",
    "Payment reminder message banao Hindi me",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, module: "assistant" }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.output || "AI response unavailable. Please configure API key in Settings.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error generating response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" /> AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask anything about your music business in Hindi, English, or Hinglish
        </p>
      </div>

      {/* Quick Prompts */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <div className="space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Start a conversation with AI. Ask about songs, clients, payments, or generate content.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === "assistant" && (
                <div className="flex gap-1 mt-3 pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => copyToClipboard(msg.content)}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    <Save className="h-3 w-3" /> Save
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    <FileDown className="h-3 w-3" /> Export
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground animate-pulse">
                AI is thinking...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI anything... (Hindi/English/Hinglish)"
          className="resize-none"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="h-auto">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
