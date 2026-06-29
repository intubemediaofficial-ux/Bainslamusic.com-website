"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/clients/${result.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Client</h1>
          <p className="text-muted-foreground">
            Add artist, singer, lyricist, or other client
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Type *</Label>
              <Select name="clientType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARTIST">Artist</SelectItem>
                  <SelectItem value="SINGER">Singer</SelectItem>
                  <SelectItem value="LYRICIST">Lyricist</SelectItem>
                  <SelectItem value="COMPOSER">Composer</SelectItem>
                  <SelectItem value="LABEL">Label</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                  <SelectItem value="VIDEO_CLIENT">Video Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input name="name" placeholder="Enter full name" required />
            </div>
            <div className="space-y-2">
              <Label>Stage Name</Label>
              <Input name="stageName" placeholder="Artist/stage name" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input name="whatsappNumber" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" placeholder="email@example.com" />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Input name="address" placeholder="Street address" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input name="city" placeholder="City" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input name="state" placeholder="State" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input name="country" placeholder="Country" defaultValue="India" />
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documents & KYC</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Aadhaar Number</Label>
              <Input name="aadhaarNumber" placeholder="XXXX XXXX XXXX" />
            </div>
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <Input name="panNumber" placeholder="ABCDE1234F" />
            </div>
            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input name="gstNumber" placeholder="GST Number" />
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input name="bankName" placeholder="Bank name" />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input name="accountNumber" placeholder="Account number" />
            </div>
            <div className="space-y-2">
              <Label>IFSC Code</Label>
              <Input name="ifsc" placeholder="IFSC code" />
            </div>
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <Input name="upiId" placeholder="name@upi" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue & Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Revenue Share %</Label>
              <Input
                name="revenueSharePercentage"
                type="number"
                placeholder="e.g. 70"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label>Advance Amount</Label>
              <Input name="advanceAmount" type="number" placeholder="0" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notes</Label>
              <Textarea name="notes" placeholder="Internal notes..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Client"}
          </Button>
          <Link href="/clients">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
