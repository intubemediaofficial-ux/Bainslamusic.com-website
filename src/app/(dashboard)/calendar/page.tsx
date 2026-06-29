import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          Recordings, shoots, releases, and deadlines
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Schedule View</h3>
          <p className="text-sm text-muted-foreground">
            Calendar view of all recordings, video shoots, release dates, payment deadlines, and task due dates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
