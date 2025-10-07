import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/firebase";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { Box, Factory, List, LogOut, Search } from "lucide-react";

type Listing = {
  id: string;
  material: string;
  quantity: string;
  location: string;
  price: number;
  sellerName: string;
  sellerId: string;
  createdAt?: any;
};

const Marketplace = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [userDoc, setUserDoc] = useState<any | null>(null);

  useEffect(() => {
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data: Listing[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Listing, "id">) }));
      setListings(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let unsubDoc: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) return;
      const ref = doc(db, "users", u.uid);
      unsubDoc = onSnapshot(
        ref,
        (snap) => {
          if (!snap.exists()) return;
          const d: any = snap.data();
          console.debug("users doc", d);
          const normalized = {
            name: d.name ?? "",
            email: d.email ?? "",
            organizationName: d.organizationName ?? d.organization_name ?? d.orgName ?? d.companyName ?? d.organization ?? d.company ?? "",
            organizationAddress: d.organizationAddress ?? d.organization_address ?? d.company_address ?? d.address ?? "",
            officialEmail: d.officialEmail ?? d.official_email ?? d.officialEmailAddress ?? d.official_email_address ?? "",
            organizationType: d.organizationType ?? d.organization_type ?? d.orgType ?? d.type ?? "",
          };
          setUserDoc(normalized);
        },
        async (err) => {
          console.warn("users doc listener denied, falling back to getDoc:", err?.message);
          try {
            const snap = await getDoc(ref);
            if (snap.exists()) {
              const d: any = snap.data();
              const normalized = {
                name: d.name ?? "",
                email: d.email ?? "",
                organizationName: d.organizationName ?? d.organization_name ?? d.orgName ?? d.companyName ?? d.organization ?? d.company ?? "",
                organizationAddress: d.organizationAddress ?? d.organization_address ?? d.company_address ?? d.address ?? "",
                officialEmail: d.officialEmail ?? d.official_email ?? d.officialEmailAddress ?? d.official_email_address ?? "",
                organizationType: d.organizationType ?? d.organization_type ?? d.orgType ?? d.type ?? "",
              };
              setUserDoc(normalized);
            }
          } catch (_) {
            // ignore; keep dialog with auth basics only
          }
        }
      );
    });
    return () => {
      unsubDoc?.();
      unsubAuth();
    };
  }, []);

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return listings;
    return listings.filter((l) => (l.material || "").toLowerCase().includes(term));
  }, [search, listings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast({ title: "You must be logged in to post." });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        material: material.trim(),
        quantity: quantity.trim(),
        location: location.trim(),
        price: Number(price),
        sellerName: auth.currentUser.displayName || "Unknown",
        sellerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "listings"), payload);
      setDialogOpen(false);
      setMaterial("");
      setQuantity("");
      setLocation("");
      setPrice("");
      toast({ title: "Listing posted successfully" });
    } catch (err: any) {
      toast({ title: "Failed to post listing", description: err?.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <SidebarProvider>
      <Sidebar className="bg-[#1a4f8b] text-white">
        <SidebarHeader>
          <div className="p-4">
            <div className="flex items-center justify-between gap-2 rounded-md border border-white/20 p-3">
              <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 bg-white text-[#1a4f8b] hover:bg-white/90 border-white">
                    {auth.currentUser?.displayName || "Account"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Account Details</DialogTitle>
                    <DialogDescription>Your profile from EConstruct</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {userDoc?.name || auth.currentUser?.displayName || "-"}</div>
                    <div><span className="font-medium">Email:</span> {userDoc?.email || auth.currentUser?.email || "-"}</div>
                    <div><span className="font-medium">Organization Name:</span> {userDoc?.organizationName || "-"}</div>
                    <div><span className="font-medium">Organization Address:</span> {userDoc?.organizationAddress || "-"}</div>
                    <div><span className="font-medium">Official Email Address:</span> {userDoc?.officialEmail || "-"}</div>
                    <div><span className="font-medium">Organization Type:</span> {userDoc?.organizationType || "-"}</div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 px-2">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="bg-white/10" />
        <SidebarContent>
          <div className="p-4">
            <div className="rounded-md border border-white/15 p-2 space-y-1 bg-white/5">
              <SidebarMenu>
                <SidebarMenuItem>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuButton isActive={dialogOpen} className="font-medium hover:bg-white/10 data-[active=true]:bg-white/15">
                        <Factory className="h-4 w-4" />
                        <span>SELL ITEMS</span>
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sell Your Surplus</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="material">Material</Label>
                          <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price</Label>
                          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post Listing"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-white/10">
                    <Factory className="h-4 w-4" />
                    <span>CHECK INVENTORY</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-white/10">
                    <Box className="h-4 w-4" />
                    <span>TRACK</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </div>
        </SidebarContent>
        <SidebarSeparator className="bg-white/10" />
        <SidebarFooter>
          <div className="px-4 py-3 text-xs text-white/80">EConstruct</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted">
          <div className="flex h-full flex-col">
          <div className="p-6">
            <h1 className="text-4xl font-bold tracking-tight">MARKETPLACE</h1>
            <div className="mt-4 max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6 pt-0">
            <div className="space-y-6 w-full max-w-none">
              {filteredListings.map((l) => (
                <Card key={l.id} className="w-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">{l.material}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="rounded-md border p-4 text-sm space-y-2">
                        <div><span className="font-medium">Quantity:</span> {l.quantity}</div>
                        <div><span className="font-medium">Location:</span> {l.location}</div>
                        <div className="text-lg"><span className="font-medium">Price:</span> {Intl.NumberFormat(undefined, { style: "currency", currency: "INR" }).format(Number(l.price || 0))}</div>
                        <div className="text-muted-foreground">Seller: {l.sellerName}</div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="secondary" className="px-8">Buy</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredListings.length === 0 && (
                <div className="text-sm text-muted-foreground">No listings found.</div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Marketplace;


