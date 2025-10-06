import { Shield } from "lucide-react";

export const Trust = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-12 rounded-lg shadow-medium border-2 border-primary/10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">
                  Built on Trust & Transparency
                </h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our network is built on trust. Every member is verified, and every 
                  transaction is rated. We are proud to be powered by the industry-leading 
                  logistics technology of our partner.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Powered by</span>
                  <div className="px-6 py-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold text-primary">cognecto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
