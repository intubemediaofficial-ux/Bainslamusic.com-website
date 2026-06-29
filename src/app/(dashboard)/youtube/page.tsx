import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, MonitorPlay, TrendingUp, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getChannels() {
  return prisma.youtubeChannel.findMany({
    orderBy: { subscribersCount: "desc" },
    include: { _count: { select: { videos: true } } },
  });
}

export default async function YouTubePage() {
  const channels = await getChannels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">YouTube Management</h1>
          <p className="text-muted-foreground">
            Manage channels, uploads, SEO, and thumbnails
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Channel
        </Button>
      </div>

      {/* Quick Links */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/youtube/channels">
          <Button variant="outline" size="sm">All Channels</Button>
        </Link>
        <Link href="/youtube/videos">
          <Button variant="outline" size="sm">Videos</Button>
        </Link>
        <Link href="/youtube/seo">
          <Button variant="outline" size="sm">SEO Generator</Button>
        </Link>
        <Link href="/artwork/generator">
          <Button variant="outline" size="sm">Thumbnail Generator</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <MonitorPlay className="h-5 w-5 text-red-500 mb-2" />
            <p className="text-2xl font-bold">{channels.length}</p>
            <p className="text-xs text-muted-foreground">Channels</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <TrendingUp className="h-5 w-5 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">
              {channels.reduce((sum, c) => sum + (c.subscribersCount || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Eye className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold">
              {channels.reduce((sum, c) => sum + (c.monthlyViews || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Monthly Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <DollarSign className="h-5 w-5 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">
              ₹{channels.reduce((sum, c) => sum + (c.monthlyRevenue || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Channels List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Channels</CardTitle>
        </CardHeader>
        <CardContent>
          {channels.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No YouTube channels added yet. Add your first channel to start managing.
            </p>
          ) : (
            <div className="space-y-3">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <MonitorPlay className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">{channel.channelName}</p>
                      <p className="text-xs text-muted-foreground">
                        {channel.subscribersCount?.toLocaleString()} subscribers &bull;{" "}
                        {channel._count.videos} videos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {channel.copyrightStrikes && channel.copyrightStrikes > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {channel.copyrightStrikes} strikes
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {channel.monetizationStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
