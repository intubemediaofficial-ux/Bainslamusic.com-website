import Link from "next/link";
import { Bot, Sparkles, FileText, Shield, BarChart3, MessageSquare, Image, MonitorPlay } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const aiModules = [
  {
    title: "AI Assistant",
    description: "Chat with AI about your music business",
    href: "/ai/assistant",
    icon: MessageSquare,
    color: "text-purple-500",
  },
  {
    title: "YouTube SEO Generator",
    description: "Generate titles, descriptions, tags, hashtags",
    href: "/ai/assistant?module=seo",
    icon: MonitorPlay,
    color: "text-red-500",
  },
  {
    title: "Thumbnail Prompt Generator",
    description: "Generate thumbnail concepts and prompts",
    href: "/ai/assistant?module=thumbnail",
    icon: Image,
    color: "text-pink-500",
  },
  {
    title: "Agreement Generator",
    description: "Generate singer, writer, studio agreements",
    href: "/ai/assistant?module=agreement",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    title: "Copyright Notice Generator",
    description: "Generate DMCA notices and copyright claims",
    href: "/ai/assistant?module=copyright",
    icon: Shield,
    color: "text-amber-500",
  },
  {
    title: "Daily Report Generator",
    description: "Generate daily company activity report",
    href: "/ai/assistant?module=report",
    icon: BarChart3,
    color: "text-green-500",
  },
  {
    title: "Client Summary Generator",
    description: "Generate client overview and pending actions",
    href: "/ai/assistant?module=client",
    icon: Sparkles,
    color: "text-indigo-500",
  },
  {
    title: "AI Settings",
    description: "Configure AI provider, model, and preferences",
    href: "/ai/settings",
    icon: Bot,
    color: "text-gray-500",
  },
];

export default function AiToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Tools</h1>
        <p className="text-muted-foreground">
          AI-powered tools for content generation, SEO, and business automation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={module.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <Icon className={`h-8 w-8 mb-3 ${module.color}`} />
                  <h3 className="font-medium mb-1">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Prompt Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Prompt Templates</CardTitle>
            <Link href="/ai/templates">
              <Button variant="outline" size="sm">Manage Templates</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create and manage reusable AI prompt templates for SEO, agreements, notices, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
