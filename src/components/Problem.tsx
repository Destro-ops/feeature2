import { AlertCircle, TrendingDown, Leaf } from "lucide-react";

export const Problem = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: "Landfill Costs",
      description: "Millions wasted on disposal fees",
    },
    {
      icon: AlertCircle,
      title: "Wasted Materials",
      description: "70% of waste is recyclable",
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Billions of tons in landfills yearly",
    },
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stop Burying Your Profits
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The construction industry generates over a billion tons of waste annually, 
            and nearly 70% of it is recyclable. Fragmented systems mean valuable materials 
            end up in landfills, costing you money and harming the environment. We're changing that.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg shadow-soft text-center hover:shadow-medium transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <problem.icon className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
