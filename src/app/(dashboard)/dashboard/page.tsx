import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  Music,
  Users,
  CreditCard,
  Shield,
  AlertTriangle,
  MonitorPlay,
  DollarSign,
  CheckSquare,
  Clock,
  Mic2,
  Video,
  Palette,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getDashboardStats() {
  const [
    totalSongs,
    pendingSongs,
    releasedSongs,
    recordingSongs,
    editingSongs,
    distributionSongs,
    activeClients,
    totalTasks,
    pendingTasks,
    youtubeChannels,
  ] = await Promise.all([
    prisma.song.count(),
    prisma.song.count({ where: { releaseStatus: "pending" } }),
    prisma.song.count({ where: { releaseStatus: "released" } }),
    prisma.song.count({ where: { currentStage: "RECORDING_BOOKED" } }),
    prisma.song.count({ where: { currentStage: "EDITING" } }),
    prisma.song.count({ where: { currentStage: "DISTRIBUTION_SUBMITTED" } }),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "PENDING" } }),
    prisma.youtubeChannel.count(),
  ]);

  return {
    totalSongs,
    pendingSongs,
    releasedSongs,
    recordingSongs,
    editingSongs,
    distributionSongs,
    activeClients,
    totalTasks,
    pendingTasks,
    youtubeChannels,
  };
}

async function getRecentSongs() {
  return prisma.song.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { singer: true },
  });
}

async function getPendingTasks() {
  return prisma.task.findMany({
    where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
    take: 5,
    orderBy: { dueDate: "asc" },
    include: { assignedTo: true },
  });
}

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await getDashboardStats();
  const recentSongs = await getRecentSongs();
  const pendingTasks = await getPendingTasks();

  const statCards = [
    { label: "Total Songs", value: stats.totalSongs, icon: Music, color: "text-blue-500" },
    { label: "Songs Pending", value: stats.pendingSongs, icon: Clock, color: "text-yellow-500" },
    { label: "Songs Released", value: stats.releasedSongs, icon: TrendingUp, color: "text-green-500" },
    { label: "In Recording", value: stats.recordingSongs, icon: Mic2, color: "text-purple-500" },
    { label: "In Editing", value: stats.editingSongs, icon: Video, color: "text-orange-500" },
    { label: "In Distribution", value: stats.distributionSongs, icon: Globe, color: "text-cyan-500" },
    { label: "Active Clients", value: stats.activeClients, icon: Users, color: "text-indigo-500" },
    { label: "Payment Pending", value: "₹0", icon: CreditCard, color: "text-red-500" },
    { label: "Copyright Cases", value: 0, icon: Shield, color: "text-amber-500" },
    { label: "DMCA Notices", value: 0, icon: AlertTriangle, color: "text-rose-500" },
    { label: "YouTube Channels", value: stats.youtubeChannels, icon: MonitorPlay, color: "text-red-500" },
    { label: "Total Revenue", value: "₹0", icon: DollarSign, color: "text-emerald-500" },
    { label: "This Month", value: "₹0", icon: TrendingUp, color: "text-teal-500" },
    { label: "Today's Tasks", value: stats.pendingTasks, icon: CheckSquare, color: "text-violet-500" },
  ];

  const quickActions = [
    { label: "Add Client", href: "/clients/new", icon: Users },
    { label: "Add Song", href: "/songs/new", icon: Music },
    { label: "Generate SEO", href: "/ai", icon: MonitorPlay },
    { label: "Create Thumbnail", href: "/artwork/generator", icon: Palette },
    { label: "Add Task", href: "/tasks", icon: CheckSquare },
    { label: "AI Assistant", href: "/ai/assistant", icon: Bot },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {session?.name || "Admin"}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with Bainsla Music today.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {session?.role?.replace("_", " ")}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Songs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Songs</CardTitle>
              <Link href="/songs">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentSongs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No songs yet. Add your first song.
              </p>
            ) : (
              <div className="space-y-3">
                {recentSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                  >
                    <div>
                      <p className="text-sm font-medium">{song.songTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {song.singer?.stageName || song.singer?.name || "Unknown"} &bull;{" "}
                        {song.category}
                      </p>
                    </div>
                    <StageBadge stage={song.currentStage} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Tasks</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending tasks. Great job!
              </p>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.assignedTo?.name || "Unassigned"} &bull;{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Daily Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            AI Daily Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {stats.totalSongs > 0
              ? `Today ${stats.pendingSongs} songs are pending, ${stats.pendingTasks} tasks need attention, and ${stats.activeClients} clients are active. ${stats.recordingSongs > 0 ? `${stats.recordingSongs} songs are in recording stage.` : ""}`
              : "Welcome to Bainsla Music OS! Start by adding clients and songs to see your AI-powered daily summary here."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const stageColors: Record<string, string> = {
    IDEA: "bg-gray-500/10 text-gray-500",
    LYRICS: "bg-blue-500/10 text-blue-500",
    RECORDING_BOOKED: "bg-purple-500/10 text-purple-500",
    RECORDING_DONE: "bg-indigo-500/10 text-indigo-500",
    MIXING: "bg-cyan-500/10 text-cyan-500",
    MASTERING: "bg-teal-500/10 text-teal-500",
    RELEASED: "bg-green-500/10 text-green-500",
    DISTRIBUTION_LIVE: "bg-emerald-500/10 text-emerald-500",
  };
  const color = stageColors[stage] || "bg-yellow-500/10 text-yellow-500";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
      {stage.replace(/_/g, " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: "bg-gray-500/10 text-gray-500",
    MEDIUM: "bg-blue-500/10 text-blue-500",
    HIGH: "bg-orange-500/10 text-orange-500",
    URGENT: "bg-red-500/10 text-red-500",
  };
  const color = colors[priority] || "bg-gray-500/10 text-gray-500";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
      {priority}
    </span>
  );
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  );
}

function Bot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  );
}
