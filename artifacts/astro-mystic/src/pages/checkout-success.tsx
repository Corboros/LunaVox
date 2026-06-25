import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Particles } from "@/components/layout/particles";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative flex items-center justify-center p-4">
      <Particles />
      <Card className="max-w-md w-full bg-card/80 border-[#d4a843]/30 backdrop-blur text-center relative z-10 p-8 shadow-[0_0_50px_rgba(212,168,67,0.15)]">
        <CheckCircle2 className="w-20 h-20 text-[#d4a843] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,168,67,0.5)]" />
        <h2 className="font-serif text-3xl text-white mb-4">Bienvenue, Initié</h2>
        <p className="text-[#a89bc4] text-lg leading-relaxed mb-8">
          Votre accès Premium a été activé. Les secrets de l'univers vous sont désormais grands ouverts.
        </p>
        <Link href="/app">
          <Button size="lg" className="w-full bg-[#d4a843] hover:bg-[#c49833] text-black font-serif font-bold">
            Poursuivre mon voyage
          </Button>
        </Link>
      </Card>
    </div>
  );
}
