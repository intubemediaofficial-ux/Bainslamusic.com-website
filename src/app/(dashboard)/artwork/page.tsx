import { prisma } from "@/lib/db";
import Link from "next/link";
import { Palette, Plus, Image, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getArtwork() {
  return prisma.artworkItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { song: true, designer: true },
    take: 20,
  });
}

export default async function ArtworkPage() {
  const artworks = await getArtwork();

  const statusCounts = {
    requested: artworks.filter((a) => a.status === "REQUESTED").length,
    inProgress: artworks.filter((a) =>
      ["PROMPT_GENERATED", "IMAGE_GENERATED", "DESIGNER_EDITING"].includes(a.status)
    ).length,
    pendingApproval: artworks.filter((a) => a.status === "SENT_FOR_APPROVAL").length,
    approved: artworks.filter((a) => a.status === "APPROVED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artwork Management</h1>
          <p className="text-muted-foreground">
            Thumbnails, covers, posters, and AI-generated artwork
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/artwork/generator">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" /> AI Generate
            </Button>
          </Link>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/artwork/queue">
          <Button variant="outline" size="sm">Design Queue</Button>
        </Link>
        <Link href="/artwork/generator">
          <Button variant="outline" size="sm">Image Generator</Button>
        </Link>
        <Link href="/assets">
          <Button variant="outline" size="sm">Asset Library</Button>
        </Link>
        <Link href="/assets/characters">
          <Button variant="outline" size="sm">Characters</Button>
        </Link>
        <Link href="/assets/brand-kits">
          <Button variant="outline" size="sm">Brand Kits</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-500">{statusCounts.requested}</p>
            <p className="text-xs text-muted-foreground">Requested</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-500">{statusCounts.inProgress}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-500">{statusCounts.pendingApproval}</p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">{statusCounts.approved}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Artwork List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Artwork</CardTitle>
        </CardHeader>
        <CardContent>
          {artworks.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No artwork items yet. Create your first artwork request.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {artwork.titleText || artwork.song?.songTitle || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {artwork.artworkType || "Thumbnail"} &bull;{" "}
                      {artwork.designer?.name || "Unassigned"}
                    </p>
                  </div>
                  <ArtworkStatusBadge status={artwork.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ArtworkStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    REQUESTED: "bg-yellow-500/10 text-yellow-500",
    PROMPT_GENERATED: "bg-blue-500/10 text-blue-500",
    IMAGE_GENERATED: "bg-indigo-500/10 text-indigo-500",
    DESIGNER_EDITING: "bg-purple-500/10 text-purple-500",
    SENT_FOR_APPROVAL: "bg-orange-500/10 text-orange-500",
    REVISION_REQUESTED: "bg-red-500/10 text-red-500",
    APPROVED: "bg-green-500/10 text-green-500",
    FINAL_EXPORTED: "bg-emerald-500/10 text-emerald-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[status] || ""}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
