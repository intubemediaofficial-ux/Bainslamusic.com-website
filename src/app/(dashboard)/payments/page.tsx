import { CreditCard, DollarSign, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Track payments, invoices, revenue splits, and expenses
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Record Payment
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <DollarSign className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Payment Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Track all payments, invoices, revenue shares, advances, and pending amounts. Generate payment reminders and receipts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
