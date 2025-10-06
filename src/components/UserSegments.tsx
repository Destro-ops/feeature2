import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Truck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";

export const UserSegments = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const segments = [
    {
      id: "suppliers",
      icon: Package,
      title: "For Material Suppliers",
      subtitle: "Sellers",
      headline: "Generate Revenue from Your Waste",
      benefits: [
        "Reduce disposal fees",
        "Create a new income stream",
        "Connect with verified buyers effortlessly",
      ],
      color: "primary",
    },
    {
      id: "buyers",
      icon: ShoppingCart,
      title: "For Material Requesters",
      subtitle: "Buyers",
      headline: "Source Materials Faster & Cheaper",
      benefits: [
        "Find affordable, high-quality reclaimed materials nearby",
        "Reduce project costs",
        "Shorten procurement timelines",
      ],
      color: "accent",
    },
    {
      id: "logistics",
      icon: Truck,
      title: "For Logistics Partners",
      subtitle: "Haulers",
      headline: "Maximize Your Fleet's Efficiency",
      benefits: [
        "Get access to a new stream of jobs",
        "Reduce idle time",
        "Increase the profitability of your fleet with optimized routes",
      ],
      color: "secondary",
    },
  ];

  const activeSegment = useMemo(() => segments.find((s) => s.id === activeId) || null, [activeId]);

  const handleLearnMore = (id: string) => {
    setActiveId(id);
    setOpen(true);
  };

  const ctaLabel = useMemo(() => {
    if (!activeSegment) return "Continue";
    if (activeSegment.id === "suppliers") return "Start Selling Surplus";
    if (activeSegment.id === "buyers") return "Find Materials Near You";
    if (activeSegment.id === "logistics") return "Become a Logistics Partner";
    return "Continue";
  }, [activeSegment]);

  const renderDetails = () => {
    if (!activeSegment) return null;
    if (activeSegment.id === "suppliers") {
      return (
        <div className="space-y-4">
          <p>
            Stop paying to throw away valuable materials. Our platform empowers you to turn
            surplus into a reliable revenue stream.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">AI-Powered Listings:</span> <strong>Snap a photo and our AI does the rest</strong>. It instantly identifies your material, 
              grades its quality, and creates a trusted listing for buyers.
            </li>
            <li>
              <span className="font-medium text-foreground">Autodesk Integration:</span><strong> Compare your Bill of Quantities (BoQ) along with Autodesk 3D model</strong>. Our system identifies residual as well as 
              excess helping you to <strong>SELL</strong> or <strong>BUY</strong> from the marketplace effortlessly.
            </li>
            <li>
              <span className="font-medium text-foreground">Build Your Reputation:</span> Receive ratings from buyers
              based on material quality and earn an <strong>EcoRating</strong> for every transaction, showcasing your
              <strong> commitment to sustainability and reducing your carbon footprint.</strong>
            </li>
          </ul>
        </div>
      );
    }
    if (activeSegment.id === "buyers") {
      return (
        <div className="space-y-4">
          <p>
            Gain a competitive edge by sourcing affordable, high-quality reclaimed materials from local job sites you
            can trust.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Verified Quality:</span> <strong>Browse listings with confidence.</strong>
              Every item is analyzed by our AI, complete with a quality score and material verification. 
            </li>
            <li>
              <span className="font-medium text-foreground">Smart Sourcing:</span> Integrate your Autodesk plans to
              automatically identify material shortfalls. <strong>Our platform will then proactively suggest available materials </strong>
              from our marketplace, saving you time and money.
            </li>
            <li>
              <span className="font-medium text-foreground">Boost Your Green Score:</span> Every purchase from the marketplace
              it leads to <strong>improved EcoRating</strong> for the company. <strong>Providing tangible data for your
              sustainability and ESG reports.</strong>
            </li>
          </ul>
        </div>
      );
    }
    // logistics
    return (
      <div className="space-y-4">
        <p>
          Fill your fleet's schedule and eliminate costly idle time. EConstruct gives you access to a steady stream of
          local transport jobs, backed by industry-leading technology.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Automated Logistics:</span> <strong>Our platform dispatches jobs
            automatically.</strong> We partner with <strong>Cognecto</strong> to provide real-time location tracking and fuel
            efficiency metrics.
          </li>
          <li>
            <span className="font-medium text-foreground">Full Transparency:</span>Sellers and buyers can <strong>track
            the live location</strong> of their materials, <strong>providing flexibility, credibility, and quality assurance</strong> for every
            delivery you make.
          </li>
          <li>
            <span className="font-medium text-foreground">Track Your Impact:</span>The fuel efficiency data as well as the material bought 
             helps to <strong>calculate carbon savings</strong>, improving the EcoRating for you and your clients.
          </li>
        </ul>
      </div>
    );
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Who We Help: A Network for Everyone
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a growing ecosystem of construction professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {segments.map((segment) => (
            <div
              key={segment.id}
              id={segment.id}
              className="bg-card p-8 rounded-lg shadow-soft hover:shadow-large transition-all"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${segment.color}/10 mb-6`}>
                <segment.icon className={`h-8 w-8 text-${segment.color}`} />
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {segment.subtitle}
                </p>
                <h3 className="text-2xl font-bold mb-4">{segment.headline}</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {segment.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-accent mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => handleLearnMore(segment.id)}>
                Learn More
              </Button>
            </div>
          ))}
        </div>
        {activeSegment && (
          isMobile ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <div className="flex items-center gap-3">
                    <activeSegment.icon className="h-6 w-6 text-primary" />
                    <DrawerTitle>
                      {activeSegment.id === "suppliers" && "Generate Revenue from Your Waste"}
                      {activeSegment.id === "buyers" && "Source Materials Faster & Cheaper"}
                      {activeSegment.id === "logistics" && "Maximize Your Fleet's Efficiency"}
                    </DrawerTitle>
                  </div>
                  <DrawerDescription>
                    {activeSegment.title} · {activeSegment.subtitle}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">{renderDetails()}</div>
                <DrawerFooter>
                  <Button onClick={() => navigate("/profile-setup")}>{ctaLabel}</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <activeSegment.icon className="h-6 w-6 text-primary" />
                    <DialogTitle>
                      {activeSegment.id === "suppliers" && "Generate Revenue from Your Waste"}
                      {activeSegment.id === "buyers" && "Source Materials Faster & Cheaper"}
                      {activeSegment.id === "logistics" && "Maximize Your Fleet's Efficiency"}
                    </DialogTitle>
                  </div>
                  <DialogDescription>
                    {activeSegment.title} · {activeSegment.subtitle}
                  </DialogDescription>
                </DialogHeader>
                {renderDetails()}
                <DialogFooter>
                  <Button onClick={() => navigate("/profile-setup")}>{ctaLabel}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
    </section>
  );
};
