import { Shield, FileText, AlertTriangle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CopyrightPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Copyright Management</h1>
          <p className="text-muted-foreground">
            Claims, DMCA notices, evidence management, and rights registry
          </p>
        </div>
        <Button className="gap-2">
          <Shield className="h-4 w-4" /> New Copyright Case
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Song Rights Registry", description: "Complete ownership records for all songs", icon: FileText },
          { title: "Copyright Claims", description: "Track and manage copyright claims", icon: Shield },
          { title: "DMCA Notices", description: "Send and track DMCA takedown notices", icon: AlertTriangle },
          { title: "Evidence Management", description: "Store and organize copyright evidence", icon: Search },
          { title: "YouTube Claims", description: "Content ID and manual claims management", icon: Shield },
          { title: "Case Management", description: "Legal cases and dispute tracking", icon: FileText },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <Icon className="h-8 w-8 mb-3 text-amber-500" />
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Copyright Module Ready</h3>
          <p className="text-sm text-muted-foreground">
            Full copyright management system with rights registry, claims workflow, DMCA automation, evidence management, and AI copyright scanner will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
