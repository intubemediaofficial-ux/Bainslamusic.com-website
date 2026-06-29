import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Search, Filter, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getSongs() {
  return prisma.song.findMany({
    orderBy: { createdAt: "desc" },
    include: { singer: true, lyricist: true, composer: true },
  });
}

export default async function SongsPage() {
  const songs = await getSongs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Songs</h1>
          <p className="text-muted-foreground">
            Manage all songs, recordings, and releases
          </p>
        </div>
        <Link href="/songs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Song
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search songs..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{songs.length}</p>
            <p className="text-xs text-muted-foreground">Total Songs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-500">
              {songs.filter((s) => s.releaseStatus === "pending").length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">
              {songs.filter((s) => s.releaseStatus === "released").length}
            </p>
            <p className="text-xs text-muted-foreground">Released</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-500">
              {songs.filter((s) => ["RECORDING_BOOKED", "RECORDING_DONE", "MIXING", "MASTERING"].includes(s.currentStage)).length}
            </p>
            <p className="text-xs text-muted-foreground">In Production</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-purple-500">
              {songs.filter((s) => s.agreementStatus === "pending").length}
            </p>
            <p className="text-xs text-muted-foreground">Agreement Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Songs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Song Title</th>
                  <th className="text-left p-3 font-medium">Singer</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Stage</th>
                  <th className="text-left p-3 font-medium">Audio</th>
                  <th className="text-left p-3 font-medium">Video</th>
                  <th className="text-left p-3 font-medium">Agreement</th>
                  <th className="text-left p-3 font-medium">Release</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-8 text-muted-foreground">
                      <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No songs yet. Add your first song to get started.
                    </td>
                  </tr>
                ) : (
                  songs.map((song) => (
                    <tr key={song.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <Link href={`/songs/${song.id}`} className="hover:underline font-medium">
                          {song.songTitle}
                        </Link>
                        {song.alternateTitle && (
                          <p className="text-xs text-muted-foreground">{song.alternateTitle}</p>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {song.singer?.stageName || song.singer?.name || "-"}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {song.category}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <StageBadge stage={song.currentStage} />
                      </td>
                      <td className="p-3">
                        <StatusDot status={song.audioStatus || "pending"} />
                      </td>
                      <td className="p-3">
                        <StatusDot status={song.videoStatus || "pending"} />
                      </td>
                      <td className="p-3">
                        <StatusDot status={song.agreementStatus || "pending"} />
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {song.releaseDate
                          ? new Date(song.releaseDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3">
                        <Link href={`/songs/${song.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const stageColors: Record<string, string> = {
    IDEA: "bg-gray-500/10 text-gray-500",
    LYRICS: "bg-blue-500/10 text-blue-500",
    SINGER_CONFIRMED: "bg-indigo-500/10 text-indigo-500",
    AGREEMENT_PENDING: "bg-yellow-500/10 text-yellow-500",
    AGREEMENT_SIGNED: "bg-green-500/10 text-green-500",
    RECORDING_BOOKED: "bg-purple-500/10 text-purple-500",
    RECORDING_DONE: "bg-violet-500/10 text-violet-500",
    MIXING: "bg-cyan-500/10 text-cyan-500",
    MASTERING: "bg-teal-500/10 text-teal-500",
    RELEASED: "bg-emerald-500/10 text-emerald-500",
  };
  const color = stageColors[stage] || "bg-yellow-500/10 text-yellow-500";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${color}`}>
      {stage.replace(/_/g, " ")}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    completed: "bg-green-500",
    "in-progress": "bg-blue-500",
    signed: "bg-green-500",
    released: "bg-green-500",
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${colors[status] || "bg-yellow-500"}`} />
      <span className="text-xs capitalize">{status}</span>
    </div>
  );
}
