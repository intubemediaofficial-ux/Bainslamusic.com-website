import { BarChart3, MonitorPlay, Palette, Bot, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const reports = [
  { title: "YouTube Report", description: "Channel views, revenue, CTR, best/worst videos", icon: MonitorPlay, href: "/reports", color: "text-red-500" },
  { title: "Thumbnail Report", description: "Approved/rejected, best CTR, designer performance", icon: Palette, href: "/reports", color: "text-pink-500" },
  { title: "SEO Report", description: "Songs with SEO ready/missing, low scores", icon: TrendingUp, href: "/reports", color: "text-blue-500" },
  { title: "AI Usage Report", description: "Total generations, costs, most used prompts", icon: Bot, href: "/reports", color: "text-purple-500" },
  { title: "Revenue Report", description: "Monthly revenue, expenses, royalty splits", icon: BarChart3, href: "/reports", color: "text-green-500" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analytics and business intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <Icon className={`h-8 w-8 mb-3 ${report.color}`} />
                <h3 className="font-medium mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
