import { useGetSubscriptionStatus, useCreateCheckoutSession } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Star, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PremiumTab() {
  const { data: status, isLoading: statusLoading } = useGetSubscriptionStatus();
  
  // Use checkout mutation
  const createCheckout = useCreateCheckoutSession();

  const handleSubscribe = (plan: "monthly" | "annual") => {
    createCheckout.mutate({ data: { plan } }, {
      onSuccess: (res) => {
        if (res.url) {
          window.location.href = res.url;
        }
      }
    });
  };

  if (statusLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64 mx-auto bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl bg-white/5" />
          <Skeleton className="h-96 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  const isPremium = status?.isPremium;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-[#d4a843]/10 rounded-full mb-2 border border-[#d4a843]/20">
          <Crown className="w-8 h-8 text-[#d4a843]" />
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-white">LunaVox Premium</h2>
        <p className="text-lg text-[#a89bc4] max-w-2xl mx-auto">
          Élevez votre conscience cosmique avec un accès illimité aux arcanes.
        </p>

        {isPremium && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-block">
            <p className="text-emerald-400 font-medium flex items-center justify-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              Vous êtes un membre Premium actif.
            </p>
            {status.currentPeriodEnd && (
              <p className="text-sm text-emerald-400/70 mt-1">
                Renouvellement le {new Date(status.currentPeriodEnd).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        )}
      </div>

      {!isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          
          {/* Mensuel */}
          <Card className="p-8 bg-card/60 border-white/10 hover:border-[#7c5cbf]/50 transition-all flex flex-col h-full relative">
            <div className="mb-6">
              <h3 className="text-2xl font-serif text-white mb-2">Cycle Lunaire</h3>
              <p className="text-[#a89bc4] text-sm">Engagement mensuel</p>
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">9,99€</span>
              <span className="text-[#a89bc4]"> / mois</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {["Horoscopes quotidiens détaillés", "Tests de compatibilité illimités", "Accès prioritaire aux consultants", "Navigation sans publicité", "Pas d'engagement"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="p-1 bg-[#7c5cbf]/20 rounded-full shrink-0">
                    <Check className="w-3 h-3 text-[#7c5cbf]" />
                  </div>
                  <span className="text-sm text-[#e8e0f5]">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handleSubscribe("monthly")}
              disabled={createCheckout.isPending}
              className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/5"
            >
              Choisir ce forfait
            </Button>
          </Card>

          {/* Annuel */}
          <Card className="p-8 bg-gradient-to-b from-[#1a1230] to-background border-[#d4a843]/40 shadow-[0_0_30px_rgba(212,168,67,0.1)] flex flex-col h-full relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2">
              <Badge className="bg-[#d4a843] text-black hover:bg-[#d4a843] px-3 py-1 font-bold tracking-widest text-xs uppercase shadow-lg shadow-[#d4a843]/20">
                Plus populaire
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-serif text-[#d4a843] mb-2">Cycle Solaire</h3>
              <p className="text-[#a89bc4] text-sm">Engagement annuel (économisez 33%)</p>
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">79,99€</span>
              <span className="text-[#a89bc4]"> / an</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {["Horoscopes quotidiens détaillés", "Tests de compatibilité illimités", "Accès prioritaire aux consultants", "Navigation entièrement sans publicité", "Badge exclusif sur votre profil", "1 consultation offerte par an"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="p-1 bg-[#d4a843]/20 rounded-full shrink-0">
                    <Check className="w-3 h-3 text-[#d4a843]" />
                  </div>
                  <span className="text-sm text-[#e8e0f5]">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handleSubscribe("annual")}
              disabled={createCheckout.isPending}
              className="w-full h-14 bg-[#d4a843] hover:bg-[#c49833] text-black font-bold text-lg shadow-lg shadow-[#d4a843]/20"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              S'abonner maintenant
            </Button>
          </Card>

        </div>
      )}
    </div>
  );
}
