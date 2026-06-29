import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Music, CreditCard, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientProfilePage({ params }: PageProps) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      songsAsSinger: { include: { singer: true }, take: 10, orderBy: { createdAt: "desc" } },
      songParticipants: { include: { song: true }, take: 10 },
    },
  });

  if (!client) notFound();

  const totalSongs = client.songsAsSinger.length + client.songParticipants.length;
  const releasedSongs = client.songsAsSinger.filter(
    (s) => s.releaseStatus === "released"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <Badge variant="outline">{client.clientType}</Badge>
            <StatusBadge status={client.status} />
          </div>
          {client.stageName && (
            <p className="text-muted-foreground">{client.stageName}</p>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalSongs}</p>
            <p className="text-xs text-muted-foreground">Total Songs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{releasedSongs}</p>
            <p className="text-xs text-muted-foreground">Released</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {totalSongs - releasedSongs}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              ₹{client.pendingAmount || 0}
            </p>
            <p className="text-xs text-muted-foreground">Payment Due</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {client.revenueSharePercentage || 0}%
            </p>
            <p className="text-xs text-muted-foreground">Revenue Share</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {client.phone}
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {client.email}
                  </div>
                )}
                {(client.city || client.state) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {[client.city, client.state, client.country]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {client.bankName && <p>Bank: {client.bankName}</p>}
                {client.accountNumber && <p>Account: {client.accountNumber}</p>}
                {client.ifsc && <p>IFSC: {client.ifsc}</p>}
                {client.upiId && <p>UPI: {client.upiId}</p>}
                {!client.bankName && !client.upiId && (
                  <p className="text-muted-foreground">No bank details added</p>
                )}
              </CardContent>
            </Card>
          </div>

          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="songs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Songs</CardTitle>
            </CardHeader>
            <CardContent>
              {client.songsAsSinger.length === 0 &&
              client.songParticipants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No songs linked to this client yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {client.songsAsSinger.map((song) => (
                    <Link
                      key={song.id}
                      href={`/songs/${song.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{song.songTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {song.category} &bull; {song.currentStage.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {song.releaseStatus}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">₹{client.totalPaid || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Paid</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">₹{client.pendingAmount || 0}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">₹{client.advanceAmount || 0}</p>
                  <p className="text-xs text-muted-foreground">Advance</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Payment records will appear here once payments are tracked.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DocRow label="Aadhaar" value={client.aadhaarNumber} />
              <DocRow label="PAN" value={client.panNumber} />
              <DocRow label="GST" value={client.gstNumber} />
              <p className="text-sm text-muted-foreground mt-4">
                File uploads will be available in the Files module.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4" /> AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                AI can help with client-related tasks:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Generate Summary</Button>
                <Button variant="outline" size="sm">Payment Reminder</Button>
                <Button variant="outline" size="sm">Document Reminder</Button>
                <Button variant="outline" size="sm">WhatsApp Message</Button>
                <Button variant="outline" size="sm">Agreement Reminder</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[status] || ""}`}>
      {status}
    </span>
  );
}

function DocRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30">
      <span className="text-sm">{label}</span>
      {value ? (
        <span className="text-sm font-medium">{value}</span>
      ) : (
        <Badge variant="outline" className="text-xs text-yellow-500">Missing</Badge>
      )}
    </div>
  );
}
