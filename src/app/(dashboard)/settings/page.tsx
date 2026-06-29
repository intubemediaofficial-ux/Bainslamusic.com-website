import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const settingsSections = [
    { title: "Company Profile", description: "Company name, logo, contact", href: "/settings" },
    { title: "AI Settings", description: "API keys, models, preferences", href: "/ai/settings" },
    { title: "User Management", description: "Staff accounts and roles", href: "/staff" },
    { title: "Notifications", description: "Email, in-app notification rules", href: "/settings" },
    { title: "File Storage", description: "Storage provider configuration", href: "/settings" },
    { title: "Integrations", description: "YouTube, distribution, payment APIs", href: "/settings" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">System configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="font-medium mb-1">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
