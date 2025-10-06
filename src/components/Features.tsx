import { ShieldCheck, Zap, PieChart, TrendingUp } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Quality",
      description:
        "Our AI assesses material quality from just a photo, ensuring trust and transparency in every listing.",
    },
    {
      icon: Zap,
      title: "Intelligent Logistics",
      description:
        "We don't just move materials; we optimize the entire process, from finding the right truck to calculating the most fuel-efficient route.",
    },
    {
      icon: PieChart,
      title: "ESG Reporting",
      description:
        "Automatically track your carbon footprint and quantify the positive environmental impact of every transaction, making sustainability reporting easy.",
    },
    {
      icon: TrendingUp,
      title: "Predictive Sourcing",
      description:
        "Integrate with project management tools to anticipate future material needs and surpluses, turning your timeline into a supply chain advantage.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Key Features: Built for the Modern Job Site
          </h2>
          <p className="text-lg text-muted-foreground">
            Cutting-edge technology meets construction industry expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
