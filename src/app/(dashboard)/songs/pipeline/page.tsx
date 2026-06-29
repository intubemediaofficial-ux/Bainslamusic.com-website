import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PIPELINE_STAGES = [
  { key: "IDEA", label: "Idea", color: "bg-gray-500" },
  { key: "LYRICS", label: "Lyrics", color: "bg-blue-500" },
  { key: "AGREEMENT_PENDING", label: "Agreement", color: "bg-yellow-500" },
  { key: "RECORDING_BOOKED", label: "Recording", color: "bg-purple-500" },
  { key: "MIXING", label: "Mixing", color: "bg-cyan-500" },
  { key: "MASTERING", label: "Mastering", color: "bg-teal-500" },
  { key: "ARTWORK_PENDING", label: "Artwork", color: "bg-pink-500" },
  { key: "DISTRIBUTION_SUBMITTED", label: "Distribution", color: "bg-orange-500" },
  { key: "YOUTUBE_UPLOADED", label: "YouTube", color: "bg-red-500" },
  { key: "RELEASED", label: "Released", color: "bg-green-500" },
];

async function getSongsByStage() {
  const songs = await prisma.song.findMany({
    include: { singer: true },
    orderBy: { updatedAt: "desc" },
  });

  const grouped: Record<string, typeof songs> = {};
  for (const stage of PIPELINE_STAGES) {
    grouped[stage.key] = [];
  }
  grouped["OTHER"] = [];

  for (const song of songs) {
    const matchedStage = PIPELINE_STAGES.find((s) => s.key === song.currentStage);
    if (matchedStage) {
      grouped[matchedStage.key].push(song);
    } else {
      // Put in nearest stage
      const stageIndex = [
        "IDEA", "LYRICS", "SINGER_CONFIRMED", "AGREEMENT_PENDING", "AGREEMENT_SIGNED",
        "RECORDING_BOOKED", "RECORDING_DONE", "MIXING", "MASTERING", "AUDIO_FINAL",
        "ARTWORK_PENDING", "ARTWORK_APPROVED", "VIDEO_SHOOT_PENDING", "VIDEO_SHOOT_DONE",
        "EDITING", "FINAL_VIDEO_READY", "DISTRIBUTION_SUBMITTED", "DISTRIBUTION_LIVE",
        "YOUTUBE_SEO_READY", "YOUTUBE_UPLOADED", "RELEASED", "COPYRIGHT_PROTECTED", "REVENUE_STARTED",
      ].indexOf(song.currentStage);

      if (stageIndex <= 1) grouped["IDEA"].push(song);
      else if (stageIndex <= 3) grouped["AGREEMENT_PENDING"].push(song);
      else if (stageIndex <= 6) grouped["RECORDING_BOOKED"].push(song);
      else if (stageIndex <= 7) grouped["MIXING"].push(song);
      else if (stageIndex <= 9) grouped["MASTERING"].push(song);
      else if (stageIndex <= 11) grouped["ARTWORK_PENDING"].push(song);
      else if (stageIndex <= 17) grouped["DISTRIBUTION_SUBMITTED"].push(song);
      else if (stageIndex <= 19) grouped["YOUTUBE_UPLOADED"].push(song);
      else grouped["RELEASED"].push(song);
    }
  }

  return grouped;
}

export default async function PipelinePage() {
  const songsByStage = await getSongsByStage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Song Pipeline</h1>
        <p className="text-muted-foreground">
          Visual Kanban view of all songs by production stage
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.key} className="flex-shrink-0 w-72">
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-3 w-3 rounded-full ${stage.color}`} />
              <h3 className="text-sm font-medium">{stage.label}</h3>
              <Badge variant="outline" className="text-xs ml-auto">
                {songsByStage[stage.key]?.length || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {(songsByStage[stage.key] || []).map((song) => (
                <Link key={song.id} href={`/songs/${song.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate">{song.songTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {song.singer?.stageName || song.singer?.name || "No singer"}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Badge variant="outline" className="text-[9px]">
                          {song.category}
                        </Badge>
                        {song.stageStatus === "DELAYED" && (
                          <Badge variant="destructive" className="text-[9px]">
                            Delayed
                          </Badge>
                        )}
                        {song.stageStatus === "BLOCKED" && (
                          <Badge variant="destructive" className="text-[9px]">
                            Blocked
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {(!songsByStage[stage.key] || songsByStage[stage.key].length === 0) && (
                <div className="p-4 border border-dashed rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">No songs</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
