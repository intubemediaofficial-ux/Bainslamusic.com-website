import { prisma } from "./db";

interface AiRequestOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  module?: string;
  relatedType?: string;
  relatedId?: string;
  userId?: string;
}

export async function generateAiResponse(options: AiRequestOptions) {
  const settings = await prisma.aiSettings.findFirst();

  const apiKey = settings?.apiKey || process.env.OPENAI_API_KEY;
  const model = settings?.textModel || "gpt-4";
  const temperature = options.temperature ?? settings?.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? settings?.maxTokens ?? 2000;

  if (!apiKey) {
    return {
      success: false,
      output: "AI API key not configured. Please add your API key in AI Settings.",
      error: "NO_API_KEY",
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: "system",
            content:
              options.systemPrompt ||
              "You are an AI assistant for Bainsla Music Pvt. Ltd., a music company. Respond in Hindi/Hinglish when appropriate. Be professional and helpful.",
          },
          { role: "user", content: options.prompt },
        ],
      }),
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No response generated.";

    if (settings?.saveHistory !== false && options.userId) {
      await prisma.aiGeneration.create({
        data: {
          userId: options.userId,
          moduleName: options.module || "general",
          inputData: { prompt: options.prompt },
          promptUsed: options.prompt,
          aiOutput: output,
          outputType: "TEXT",
          relatedType: options.relatedType,
          relatedId: options.relatedId,
        },
      });
    }

    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      output: "AI generation failed. Please check API settings.",
      error: String(error),
    };
  }
}

export function buildSeoPrompt(songData: {
  title: string;
  singer: string;
  category: string;
  language: string;
  mood?: string;
}) {
  return `Generate YouTube SEO for this song:
Title: ${songData.title}
Singer: ${songData.singer}
Category: ${songData.category}
Language: ${songData.language}
Mood: ${songData.mood || "devotional"}

Generate:
1. 5 Viral YouTube Titles (Hindi first, then transliteration)
2. YouTube Description (SEO optimized, 500+ words)
3. 50 Tags (comma separated)
4. 20 Hashtags
5. Pinned Comment (engaging, asking for likes/subscribe)
6. Instagram Caption
7. SEO Score (0-100)

For devotional songs, use Hindi title first with English transliteration. Include "New Bhajan 2026" style keywords naturally.`;
}

export function buildThumbnailPrompt(data: {
  title: string;
  category: string;
  mood: string;
  character?: string;
  background?: string;
}) {
  return `Generate 5 YouTube thumbnail concept prompts for:
Title: ${data.title}
Category: ${data.category}
Mood: ${data.mood}
Main Character: ${data.character || "devotional scene"}
Background: ${data.background || "temple/divine"}

For each concept provide:
1. Detailed image generation prompt (Midjourney/DALL-E style)
2. Title text placement suggestion
3. Color scheme
4. CTR score estimate (0-100)
5. Why this design works

Rules:
- Face should be large and clear
- Text must be readable on mobile (3-6 words)
- High contrast colors
- Devotional: warm glow, temple, divine emotion
- Sad bhajan: dark background, emotional face
- Rasiya: bright colors, expressive, bold title`;
}

export function buildClientSummaryPrompt(clientData: {
  name: string;
  totalSongs: number;
  pendingSongs: number;
  releasedSongs: number;
  pendingPayment: number;
  agreementsMissing: number;
}) {
  return `Generate a brief professional summary for this client in Hindi/Hinglish:
Client: ${clientData.name}
Total Songs: ${clientData.totalSongs}
Pending Songs: ${clientData.pendingSongs}
Released Songs: ${clientData.releasedSongs}
Pending Payment: ₹${clientData.pendingPayment}
Agreements Missing: ${clientData.agreementsMissing}

Include: current status, pending work, suggested next action.`;
}
