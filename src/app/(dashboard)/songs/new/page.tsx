"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  stageName: string | null;
  clientType: string;
}

export default function NewSongPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(console.error);
  }, []);

  const singers = clients.filter((c) =>
    ["SINGER", "ARTIST"].includes(c.clientType)
  );
  const lyricists = clients.filter((c) =>
    ["LYRICIST", "ARTIST"].includes(c.clientType)
  );
  const composers = clients.filter((c) =>
    ["COMPOSER", "ARTIST"].includes(c.clientType)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/songs/${result.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/songs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Song</h1>
          <p className="text-muted-foreground">
            Add a new song to the pipeline
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Song Title *</Label>
              <Input name="songTitle" placeholder="Song title" required />
            </div>
            <div className="space-y-2">
              <Label>Alternate Title</Label>
              <Input name="alternateTitle" placeholder="English/alternate title" />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BHAJAN">Bhajan</SelectItem>
                  <SelectItem value="RASIYA">Rasiya</SelectItem>
                  <SelectItem value="DJ">DJ</SelectItem>
                  <SelectItem value="FOLK">Folk</SelectItem>
                  <SelectItem value="DEVOTIONAL">Devotional</SelectItem>
                  <SelectItem value="REMIX">Remix</SelectItem>
                  <SelectItem value="FILM">Film</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select name="language">
                <SelectTrigger>
                  <SelectValue placeholder="Hindi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Rajasthani">Rajasthani</SelectItem>
                  <SelectItem value="Brij">Brij Bhasha</SelectItem>
                  <SelectItem value="Sanskrit">Sanskrit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Genre</Label>
              <Input name="genre" placeholder="e.g. Devotional, Folk" />
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <Input name="mood" placeholder="e.g. Devotional, Romantic, Sad" />
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Participants</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Singer</Label>
              <Select name="singerId">
                <SelectTrigger>
                  <SelectValue placeholder="Select singer" />
                </SelectTrigger>
                <SelectContent>
                  {singers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.stageName || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lyricist</Label>
              <Select name="lyricistId">
                <SelectTrigger>
                  <SelectValue placeholder="Select lyricist" />
                </SelectTrigger>
                <SelectContent>
                  {lyricists.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.stageName || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Composer</Label>
              <Select name="composerId">
                <SelectTrigger>
                  <SelectValue placeholder="Select composer" />
                </SelectTrigger>
                <SelectContent>
                  {composers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.stageName || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Producer</Label>
              <Input name="producerName" placeholder="Producer name" />
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input name="labelName" placeholder="Bainsla Music" defaultValue="Bainsla Music" />
            </div>
            <div className="space-y-2">
              <Label>Copyright Owner</Label>
              <Input name="copyrightOwner" placeholder="Copyright owner" />
            </div>
          </CardContent>
        </Card>

        {/* Release Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Release Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Release Date</Label>
              <Input name="releaseDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label>ISRC</Label>
              <Input name="isrc" placeholder="ISRC code" />
            </div>
            <div className="space-y-2">
              <Label>UPC</Label>
              <Input name="upc" placeholder="UPC code" />
            </div>
            <div className="space-y-2">
              <Label>Revenue Share %</Label>
              <Input name="revenueSharePercentage" type="number" placeholder="70" />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Lyrics</Label>
              <Textarea name="lyrics" placeholder="Song lyrics..." rows={5} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" placeholder="Song description..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea name="internalNotes" placeholder="Internal notes for staff..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Song"}
          </Button>
          <Link href="/songs">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
