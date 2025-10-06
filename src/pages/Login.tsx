import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your EConstruct account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Log in</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New here? <a className="underline" href="/profile-setup">Create your organization profile</a>
        </p>
      </div>
    </div>
  );
};

export default Login;


