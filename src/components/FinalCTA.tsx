import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[slide_3s_linear_infinite]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Build a More Sustainable Future?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join hundreds of other construction firms, contractors, and logistics 
            providers on the EConstruct network.
          </p>
          <Link to="/profile-setup">
            <Button variant="hero" size="lg" className="text-lg px-12 py-6 h-auto">
              Join Now for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
