import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { auth, db, googleProvider } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistUserDoc = async (uid: string, nameValue: string, emailValue: string) => {
    const orgRaw = localStorage.getItem("orgProfile");
    const org = orgRaw ? JSON.parse(orgRaw) : {};

    await setDoc(doc(db, "users", uid), {
      organizationName: org.organization_name ?? "",
      organizationAddress: org.organization_address ?? "",
      officialEmail: org.official_email ?? "",
      organizationType: org.organization_type ?? "",
      name: nameValue,
      email: emailValue,
      uid,
      createdAt: serverTimestamp(),
    });
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      await persistUserDoc(cred.user.uid, name || cred.user.displayName || "", cred.user.email || email);
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await persistUserDoc(
        cred.user.uid,
        cred.user.displayName || "",
        cred.user.email || ""
      );
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-none shadow-large bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Sign up to continue to EConstruct</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-4">
              <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading} className="w-full">
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;


