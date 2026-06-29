import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Music, Mic2, Video, Palette, Globe, MonitorPlay, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STAGES = [
  "IDEA", "LYRICS", "SINGER_CONFIRMED", "AGREEMENT_PENDING", "AGREEMENT_SIGNED",
  "RECORDING_BOOKED", "RECORDING_DONE", "MIXING", "MASTERING", "AUDIO_FINAL",
  "ARTWORK_PENDING", "ARTWORK_APPROVED", "VIDEO_SHOOT_PENDING", "VIDEO_SHOOT_DONE",
  "EDITING", "FINAL_VIDEO_READY", "DISTRIBUTION_SUBMITTED", "DISTRIBUTION_LIVE",
  "YOUTUBE_SEO_READY", "YOUTUBE_UPLOADED", "RELEASED", "COPYRIGHT_PROTECTED", "REVENUE_STARTED",
];

export default async function SongDetailPage({ params }: PageProps) {
  const { id } = await params;
  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      singer: true,
      lyricist: true,
      composer: true,
      musicDirector: true,
      participants: { include: { client: true } },
      statusHistory: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!song) notFound();

  const currentStageIndex = STAGES.indexOf(song.currentStage);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/songs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{song.songTitle}</h1>
            <Badge variant="outline">{song.category}</Badge>
          </div>
          {song.alternateTitle && (
            <p className="text-muted-foreground">{song.alternateTitle}</p>
          )}
        </div>
        <Link href={`/songs/${song.id}/edit`}>
          <Button variant="outline" size="sm">Edit</Button>
        </Link>
      </div>

      {/* Pipeline Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Song Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {STAGES.map((stage, idx) => (
              <div
                key={stage}
                className={`flex-shrink-0 px-2 py-1 rounded text-[9px] font-medium ${
                  idx < currentStageIndex
                    ? "bg-green-500/20 text-green-500"
                    : idx === currentStageIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stage.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatusCard label="Audio" status={song.audioStatus || "pending"} icon={Mic2} />
        <StatusCard label="Video" status={song.videoStatus || "pending"} icon={Video} />
        <StatusCard label="Artwork" status={song.artworkStatus || "pending"} icon={Palette} />
        <StatusCard label="Agreement" status={song.agreementStatus || "pending"} icon={Shield} />
        <StatusCard label="Distribution" status={song.distributionStatus || "pending"} icon={Globe} />
        <StatusCard label="YouTube" status={song.youtubeStatus || "pending"} icon={MonitorPlay} />
        <StatusCard label="Copyright" status={song.copyrightStatus || "pending"} icon={Shield} />
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Song Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <InfoRow label="Language" value={song.language} />
                <InfoRow label="Genre" value={song.genre} />
                <InfoRow label="Mood" value={song.mood} />
                <InfoRow label="Label" value={song.labelName} />
                <InfoRow label="Producer" value={song.producerName} />
                <InfoRow label="Copyright" value={song.copyrightOwner} />
                <InfoRow label="ISRC" value={song.isrc} />
                <InfoRow label="UPC" value={song.upc} />
                <InfoRow
                  label="Release Date"
                  value={song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : null}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <InfoRow label="Singer" value={song.singer?.stageName || song.singer?.name} />
                <InfoRow label="Lyricist" value={song.lyricist?.stageName || song.lyricist?.name} />
                <InfoRow label="Composer" value={song.composer?.stageName || song.composer?.name} />
                <InfoRow label="Music Director" value={song.musicDirector?.stageName || song.musicDirector?.name} />
                <InfoRow label="Revenue Share" value={song.revenueSharePercentage ? `${song.revenueSharePercentage}%` : null} />
              </CardContent>
            </Card>
          </div>

          {song.lyrics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lyrics</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {song.lyrics}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardContent className="p-4">
              {song.participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No additional participants added.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Share %</th>
                      <th className="text-left p-2">Agreement</th>
                      <th className="text-left p-2">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {song.participants.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="p-2">{p.client.stageName || p.client.name}</td>
                        <td className="p-2">{p.role}</td>
                        <td className="p-2">{p.sharePercentage || "-"}%</td>
                        <td className="p-2">
                          <Badge variant={p.agreementSigned ? "default" : "outline"} className="text-xs">
                            {p.agreementSigned ? "Signed" : "Pending"}
                          </Badge>
                        </td>
                        <td className="p-2">{p.paymentStatus || "pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4">
              {song.statusHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No status changes recorded.</p>
              ) : (
                <div className="space-y-3">
                  {song.statusHistory.map((h) => (
                    <div key={h.id} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p>
                          {h.oldStatus && (
                            <span className="text-muted-foreground">
                              {h.oldStatus.replace(/_/g, " ")} →{" "}
                            </span>
                          )}
                          <span className="font-medium">{h.newStatus.replace(/_/g, " ")}</span>
                        </p>
                        {h.note && <p className="text-xs text-muted-foreground">{h.note}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardContent className="p-4 space-y-2">
              <LinkRow label="YouTube" url={song.youtubeLink} />
              <LinkRow label="Spotify" url={song.spotifyLink} />
              <LinkRow label="Apple Music" url={song.appleMusicLink} />
              <LinkRow label="JioSaavn" url={song.jiosaavnLink} />
              <LinkRow label="Amazon Music" url={song.amazonMusicLink} />
              <LinkRow label="YouTube Music" url={song.youtubeMusicLink} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">AI tools for this song:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Generate YouTube SEO</Button>
                <Button variant="outline" size="sm">Generate Thumbnail Prompt</Button>
                <Button variant="outline" size="sm">Generate Agreement</Button>
                <Button variant="outline" size="sm">Generate Copyright Notice</Button>
                <Button variant="outline" size="sm">Song Summary</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusCard({ label, status, icon: Icon }: { label: string; status: string; icon: React.ComponentType<{ className?: string }> }) {
  const colors: Record<string, string> = {
    pending: "text-yellow-500",
    completed: "text-green-500",
    "in-progress": "text-blue-500",
    signed: "text-green-500",
  };
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <Icon className={`h-4 w-4 mx-auto mb-1 ${colors[status] || "text-yellow-500"}`} />
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={`text-xs font-medium capitalize ${colors[status] || "text-yellow-500"}`}>
          {status}
        </p>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function LinkRow({ label, url }: { label: string; url: string | null }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30">
      <span className="text-sm">{label}</span>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
          View
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">Not added</span>
      )}
    </div>
  );
}
