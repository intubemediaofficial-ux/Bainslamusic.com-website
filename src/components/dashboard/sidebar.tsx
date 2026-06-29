"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Music,
  GitBranch,
  Mic2,
  Video,
  Palette,
  MonitorPlay,
  Globe,
  Shield,
  AlertTriangle,
  FileText,
  CreditCard,
  DollarSign,
  Archive,
  Bot,
  BarChart3,
  CheckSquare,
  Calendar,
  UserCog,
  Settings,
  FolderOpen,
  Bell,
  Search,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", href: "/clients", icon: Users },
  { title: "Songs", href: "/songs", icon: Music },
  { title: "Song Pipeline", href: "/songs/pipeline", icon: GitBranch },
  { title: "Studio", href: "/studio", icon: Mic2 },
  { title: "Video Shoot", href: "/video-shoot", icon: Video },
  { title: "Artwork", href: "/artwork", icon: Palette },
  { title: "YouTube", href: "/youtube", icon: MonitorPlay },
  { title: "Distribution", href: "/distribution", icon: Globe },
  { title: "Copyright", href: "/copyright", icon: Shield },
  { title: "DMCA", href: "/dmca", icon: AlertTriangle },
  { title: "Agreements", href: "/agreements", icon: FileText },
  { title: "Payments", href: "/payments", icon: CreditCard },
  { title: "Finance", href: "/finance", icon: DollarSign },
  { title: "Assets", href: "/assets", icon: Archive },
  { title: "AI Tools", href: "/ai", icon: Bot },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Tasks", href: "/tasks", icon: CheckSquare },
  { title: "Calendar", href: "/calendar", icon: Calendar },
  { title: "Files", href: "/files", icon: FolderOpen },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Staff", href: "/staff", icon: UserCog },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card overflow-y-auto">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Music className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-lg font-bold text-foreground">Bainsla Music</h1>
          <p className="text-[10px] text-muted-foreground -mt-0.5">
            Music OS
          </p>
        </div>
      </div>

      <nav className="space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
