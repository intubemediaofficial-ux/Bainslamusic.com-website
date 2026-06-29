import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Bell, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function NotificationsPage() {
  const session = await getSession();
  const notifications = session ? await getNotifications(session.id) : [];
  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unread.length} unread notifications
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" size="sm" className="gap-2">
            <Check className="h-4 w-4" /> Mark All Read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No notifications yet. You&apos;ll see alerts for agreements, payments, releases, and more.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-accent ${!notif.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${!notif.isRead ? "bg-primary" : "bg-transparent"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {notif.message && (
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {notif.type && (
                      <Badge variant="outline" className="text-[10px]">{notif.type}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
