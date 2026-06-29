import { Users, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage team members, roles, and permissions
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Team & Roles</h3>
          <p className="text-sm text-muted-foreground">
            Add staff members and assign roles: Manager, YouTube Manager, Copyright Manager, Designer, Studio Staff, Video Team, Accountant.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
