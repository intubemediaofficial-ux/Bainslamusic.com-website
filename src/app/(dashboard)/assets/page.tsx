import { prisma } from "@/lib/db";
import Link from "next/link";
import { Archive, Plus, Search, Image, Music, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Radha", "Krishna", "Ram", "Hanuman", "Tejaji", "Prem Mandir",
  "Vrindavan", "Barsana", "Village", "Rasiya Model", "Devotional Background",
  "Dark Background", "Fonts", "Logos", "Overlays", "Borders", "PNG Elements",
  "Singer Photos", "Saint Photos",
];

async function getAssets() {
  return prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AssetsPage() {
  const assets = await getAssets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Asset Library</h1>
          <p className="text-muted-foreground">
            Images, fonts, logos, characters, backgrounds, and templates
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Upload Asset
        </Button>
      </div>

      {/* Quick Links */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/assets/characters">
          <Button variant="outline" size="sm">Character Profiles</Button>
        </Link>
        <Link href="/assets/brand-kits">
          <Button variant="outline" size="sm">Brand Kits</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search assets by name, tag, category..." className="pl-9" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-accent">
            {cat}
          </Badge>
        ))}
      </div>

      {/* Asset Grid */}
      {assets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Archive className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-1">No Assets Yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload images, fonts, logos, and other assets to build your library.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden hover:shadow-md cursor-pointer">
              <div className="aspect-square bg-muted flex items-center justify-center">
                {asset.assetType === "image" ? (
                  <Image className="h-8 w-8 text-muted-foreground" />
                ) : asset.assetType === "audio" ? (
                  <Music className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-2">
                <p className="text-xs font-medium truncate">{asset.assetName}</p>
                <p className="text-[10px] text-muted-foreground">{asset.category || asset.assetType}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
