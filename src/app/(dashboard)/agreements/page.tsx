import { FileText, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AgreementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agreements</h1>
          <p className="text-muted-foreground">
            Singer, writer, studio, and rights agreements
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Agreement
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Agreement Management</h3>
          <p className="text-sm text-muted-foreground">
            Generate, track, and manage singer agreements, writer agreements, studio agreements, and rights assignment documents. AI-powered agreement text generation available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
