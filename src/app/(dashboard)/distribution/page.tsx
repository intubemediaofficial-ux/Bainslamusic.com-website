import { Globe, Music, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DistributionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Distribution</h1>
          <p className="text-muted-foreground">
            Manage song distribution across all platforms
          </p>
        </div>
        <Button className="gap-2">
          <Globe className="h-4 w-4" /> New Release
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Globe className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Distribution Hub</h3>
          <p className="text-sm text-muted-foreground">
            Submit songs to Spotify, Apple Music, JioSaavn, Amazon Music, YouTube Music, and more. Track release status, ISRC/UPC codes, and platform links.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
