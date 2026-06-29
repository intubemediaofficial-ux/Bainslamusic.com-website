import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateAiResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt, module, systemPrompt, relatedType, relatedId } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const result = await generateAiResponse({
    prompt,
    systemPrompt,
    module: module || "assistant",
    relatedType,
    relatedId,
    userId: session.id,
  });

  return NextResponse.json(result);
}
