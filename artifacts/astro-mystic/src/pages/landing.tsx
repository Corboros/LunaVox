import { Link } from "wouter";
import { Particles } from "@/components/layout/particles";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col items-center justify-center">
      <Particles />
      
      {/* Background imagery */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] bg-cover bg-center opacity-[0.15] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Star className="w-8 h-8 text-primary" />
            <Moon className="w-12 h-12 text-[#d4a843]" />
            <Star className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wider text-white">
            AstroMystic
          </h1>
          <p className="text-xl md:text-2xl text-[#a89bc4] max-w-2xl mx-auto font-light">
            Découvrez les secrets que les astres vous réservent. Horoscopes profonds, compatibilité mystique et consultations privées.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white px-8 h-14 text-lg font-serif shadow-lg shadow-[#7c5cbf]/20 transition-all border border-[#7c5cbf]/50">
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer le voyage
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#7c5cbf]/40 text-[#e8e0f5] hover:bg-[#7c5cbf]/10 px-8 h-14 text-lg font-serif transition-all bg-transparent">
              Se connecter
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-white/5 w-full">
          <div className="space-y-3">
            <h3 className="font-serif text-[#d4a843] text-xl">Horoscope Quotidien</h3>
            <p className="text-[#a89bc4] text-sm leading-relaxed">Laissez les étoiles guider votre journée avec des prédictions précises sur l'amour, le travail et la santé.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-[#d4a843] text-xl">Compatibilité</h3>
            <p className="text-[#a89bc4] text-sm leading-relaxed">Explorez la synergie cosmique entre vous et vos proches pour mieux comprendre vos relations.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-[#d4a843] text-xl">Consultants Experts</h3>
            <p className="text-[#a89bc4] text-sm leading-relaxed">Connectez-vous avec des astrologues et voyants professionnels pour des lectures personnalisées.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
