import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getClients() {
  return prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { songsAsSinger: true, songParticipants: true },
      },
    },
  });
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage artists, singers, composers, and all clients
          </p>
        </div>
        <Link href="/clients/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {clients.filter((c) => c.status === "ACTIVE").length}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {clients.filter((c) => c.clientType === "SINGER").length}
            </p>
            <p className="text-xs text-muted-foreground">Singers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {clients.filter((c) => c.clientType === "LYRICIST").length}
            </p>
            <p className="text-xs text-muted-foreground">Lyricists</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Phone</th>
                  <th className="text-left p-3 font-medium">Songs</th>
                  <th className="text-left p-3 font-medium">Revenue %</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      No clients yet. Add your first client to get started.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          {client.stageName && (
                            <p className="text-xs text-muted-foreground">
                              {client.stageName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {client.clientType}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {client.phone || "-"}
                      </td>
                      <td className="p-3">
                        {client._count.songsAsSinger + client._count.songParticipants}
                      </td>
                      <td className="p-3">
                        {client.revenueSharePercentage
                          ? `${client.revenueSharePercentage}%`
                          : "-"}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="p-3">
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-500",
    INACTIVE: "bg-gray-500/10 text-gray-500",
    BLOCKED: "bg-red-500/10 text-red-500",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[status] || colors.ACTIVE}`}
    >
      {status}
    </span>
  );
}
