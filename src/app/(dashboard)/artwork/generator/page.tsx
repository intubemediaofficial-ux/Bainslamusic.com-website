"use client";

import { useState } from "react";
import { Sparkles, Image, Download, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ArtworkGeneratorPage() {
  const [generating, setGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate 5 thumbnail/artwork image generation prompts for:
Song Title: ${data.songTitle}
Category: ${data.category}
Mood: ${data.mood}
Main Character: ${data.character}
Background: ${data.background}
Platform: ${data.platform}
Style: ${data.style}
Text Language: ${data.textLanguage}

For each prompt provide:
1. Detailed image prompt (Midjourney/DALL-E style)
2. Title text suggestion
3. Color scheme
4. CTR score (0-100)

Follow rules:
- Face should be large and clear
- Text readable on mobile
- High contrast
- Safe for YouTube`,
          module: "thumbnail",
        }),
      });

      const result = await res.json();
      if (result.output) {
        setGeneratedPrompts([result.output]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" /> AI Image & Thumbnail Generator
        </h1>
        <p className="text-muted-foreground">
          Generate thumbnail concepts, cover art, and image prompts using AI
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generation Request</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Song Title</Label>
              <Input name="songTitle" placeholder="Song title" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bhajan">Bhajan</SelectItem>
                  <SelectItem value="rasiya">Rasiya</SelectItem>
                  <SelectItem value="devotional">Devotional</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                  <SelectItem value="dj">DJ</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select name="mood">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="devotional">Devotional</SelectItem>
                  <SelectItem value="emotional">Emotional</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="peaceful">Peaceful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Main Character</Label>
              <Select name="character">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="radha">Radha</SelectItem>
                  <SelectItem value="krishna">Krishna</SelectItem>
                  <SelectItem value="radha-krishna">Radha Krishna</SelectItem>
                  <SelectItem value="ram">Ram</SelectItem>
                  <SelectItem value="hanuman">Hanuman</SelectItem>
                  <SelectItem value="singer">Singer</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="saint">Saint</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <Select name="background">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prem-mandir">Prem Mandir</SelectItem>
                  <SelectItem value="vrindavan">Vrindavan</SelectItem>
                  <SelectItem value="barsana">Barsana</SelectItem>
                  <SelectItem value="temple">Temple</SelectItem>
                  <SelectItem value="village">Village</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="dark">Dark Background</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platform Size</Label>
              <Select name="platform">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube-thumbnail">YouTube Thumbnail (1280x720)</SelectItem>
                  <SelectItem value="spotify-cover">Spotify Cover (3000x3000)</SelectItem>
                  <SelectItem value="youtube-shorts">YouTube Shorts (1080x1920)</SelectItem>
                  <SelectItem value="instagram">Instagram (1080x1080)</SelectItem>
                  <SelectItem value="facebook">Facebook (1200x630)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Text Language</Label>
              <Select name="textLanguage">
                <SelectTrigger><SelectValue placeholder="Hindi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="both">Both Hindi + English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <Select name="style">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="devotional">Devotional Glow</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="bold">Bold & Bright</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="dark">Dark Emotional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Additional Instructions</Label>
              <Textarea name="extraInstructions" placeholder="Any extra details..." rows={2} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={generating} className="gap-2">
          <Sparkles className="h-4 w-4" />
          {generating ? "Generating..." : "Generate Thumbnail Prompts"}
        </Button>
      </form>

      {/* Generated Output */}
      {generatedPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedPrompts.map((prompt, idx) => (
              <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{prompt}</pre>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3 w-3" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Save className="h-3 w-3" /> Save to Library
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Image className="h-3 w-3" /> Generate Image
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Placeholder for image generation */}
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Image className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Image Generation</h3>
          <p className="text-sm text-muted-foreground">
            Connect an image generation API (DALL-E, Midjourney, Stable Diffusion) in Settings to generate images directly in the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
