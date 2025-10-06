import { Camera, Truck, BarChart3 } from "lucide-react";
import listSurplus from "@/assets/list-surplus.png";
import transport from "@/assets/transport.png";
import { AspectRatio } from "@/components/ui/aspect-ratio";
export const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      number: "1",
      title: "List & Verify",
      heading: "List Your Surplus Materials",
      description:
        "Have extra bricks, lumber, or steel? Snap a photo. Our AI-powered image recognition instantly verifies the material type and quality, so buyers know exactly what they're getting.",
    },
    {
      icon: Truck,
      number: "2",
      title: "Match & Move",
      heading: "Get Matched with a Buyer",
      description:
        "Our platform connects you with nearby sites that need your materials. Once a match is made, our logistics engine automatically dispatches the nearest, most efficient truck to handle the transport.",
    },
    {
      icon: BarChart3,
      number: "3",
      title: "Transact & Track",
      heading: "Complete the Transaction",
      description:
        "Track your delivery in real-time. Once delivered, the transaction is completed through the platform. Rate your experience and get a detailed report on your cost savings and environmental impact.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works: Simple, Smart, Seamless
          </h2>
          <p className="text-lg text-muted-foreground">
            Three easy steps to transform your construction waste into revenue
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 items-center`}
            >
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold text-primary">
                    {step.number}
                  </span>
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {step.title}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {step.heading}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex-1 bg-muted rounded-lg flex items-center justify-center shadow-soft overflow-hidden p-2">
                {index === 0 ? (
                  // Illustration for "List Your Surplus Materials"
                  <AspectRatio ratio={16 / 8} className="w-full">
                    <img
                      src={listSurplus}
                      alt="List your surplus material - AI verification flow"
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </AspectRatio>
                ) : index === 1 ? (
                  // Illustration for "Get Matched with a Buyer"
                  <AspectRatio ratio={14 / 8} className="w-full">
                    <img
                      src={transport}
                      alt="Match & Move: Get matched with a buyer and fastest route"
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </AspectRatio>
                ) : (
                  <step.icon className="h-32 w-32 text-muted-foreground/20" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
