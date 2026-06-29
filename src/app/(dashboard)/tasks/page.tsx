import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckSquare, Clock, AlertCircle } from "lucide-react";

async function getTasks() {
  return prisma.task.findMany({
    orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
    include: { assignedTo: true, createdBy: true },
  });
}

export default async function TasksPage() {
  const tasks = await getTasks();
  const pending = tasks.filter((t) => t.status === "PENDING");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completed = tasks.filter((t) => t.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage team tasks and deadlines</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{pending.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{inProgress.length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{completed.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks yet. Create tasks to track team work.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        task.status === "COMPLETED"
                          ? "bg-green-500"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.assignedTo?.name || "Unassigned"} &bull;{" "}
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <Badge variant="outline" className="text-xs capitalize">
                      {task.status.replace("_", " ").toLowerCase()}
                    </Badge>
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

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: "bg-gray-500/10 text-gray-500",
    MEDIUM: "bg-blue-500/10 text-blue-500",
    HIGH: "bg-orange-500/10 text-orange-500",
    URGENT: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[priority] || ""}`}>
      {priority}
    </span>
  );
}
