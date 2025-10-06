import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileSetup = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organization_name: "",
    organization_address: "",
    official_email: "",
    organization_type: "",
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.organization_name || !formData.organization_address || !formData.official_email || !formData.organization_type) {
      setError("Please fill in all required fields");
      return;
    }
    setIsSaving(true);
    try {
      localStorage.setItem(
        "orgProfile",
        JSON.stringify({
          organization_name: formData.organization_name,
          organization_address: formData.organization_address,
          official_email: formData.official_email,
          organization_type: formData.organization_type,
        })
      );
      window.location.href = "/signup";
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">EConstruct</span>
          </h1>
          <p className="text-gray-600 text-lg">Complete your organization profile to get started</p>
        </div>

        <Card className="border-none shadow-large bg-white/90 backdrop-blur">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-2xl flex items-center gap-2">
              Organization Details
            </CardTitle>
            <CardDescription className="text-base">All fields are required</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="org_name" className="text-base font-medium">Organization Name *</Label>
                <Input id="org_name" value={formData.organization_name} onChange={(e) => setFormData((p) => ({ ...p, organization_name: e.target.value }))} placeholder="ABC Construction Ltd." className="h-12 text-base" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org_address" className="text-base font-medium">Organization Address *</Label>
                <Textarea id="org_address" value={formData.organization_address} onChange={(e) => setFormData((p) => ({ ...p, organization_address: e.target.value }))} placeholder="Full business address including city and postal code" className="min-h-24 text-base" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="official_email" className="text-base font-medium">Official Email Address *</Label>
                <Input id="official_email" type="email" value={formData.official_email} onChange={(e) => setFormData((p) => ({ ...p, official_email: e.target.value }))} placeholder="contact@company.com" className="h-12 text-base" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org_type" className="text-base font-medium">Organization Type *</Label>
                <Select value={formData.organization_type} onValueChange={(value) => setFormData((p) => ({ ...p, organization_type: value }))}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Material Supplier</SelectItem>
                    <SelectItem value="buyer">Material Buyer</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6">
                <Button type="submit" disabled={isSaving} className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg">
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-3" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;


