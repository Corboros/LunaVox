import { useState } from "react";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { useGetDailyHoroscope, getGetDailyHoroscopeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Briefcase, Activity, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdBanner } from "@/components/layout/ad-banner";

export default function HoroscopeTab() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);

  const { data: horoscope, isLoading, isError } = useGetDailyHoroscope(selectedSign!, {
    query: {
      enabled: !!selectedSign && reveal,
      queryKey: getGetDailyHoroscopeQueryKey(selectedSign!),
    }
  });

  const getDomainIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "amour": return <Heart className="w-5 h-5 text-rose-400" />;
      case "travail": return <Briefcase className="w-5 h-5 text-amber-600" />;
      case "santé": return <Activity className="w-5 h-5 text-emerald-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-3xl md:text-4xl text-white">Votre Horoscope</h2>
        <p className="text-[#a89bc4]">Sélectionnez votre signe pour découvrir ce que les astres vous réservent aujourd'hui.</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {ZODIAC_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => {
              setSelectedSign(sign.id);
              setReveal(false);
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              selectedSign === sign.id
                ? "bg-[#7c5cbf]/20 border-[#7c5cbf] shadow-[0_0_15px_rgba(124,92,191,0.3)]"
                : "bg-card/50 border-white/5 hover:border-white/20 hover:bg-card"
            }`}
          >
            <span className="text-3xl mb-2">{sign.symbol}</span>
            <span className="text-xs font-medium text-[#e8e0f5]">{sign.name}</span>
          </button>
        ))}
      </div>

      {/* Ad banner between sign grid and reveal button */}
      <AdBanner slot="leaderboard" />

      {selectedSign && !reveal && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => setReveal(true)}
            size="lg" 
            className="bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white font-serif px-8 h-14 shadow-lg shadow-[#7c5cbf]/20"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Révéler mon horoscope
          </Button>
        </div>
      )}

      {reveal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            {isLoading ? (
              <Card className="p-8 bg-card/80 border-[#7c5cbf]/30 backdrop-blur">
                <div className="space-y-6">
                  <Skeleton className="h-8 w-1/3 bg-white/5" />
                  <Skeleton className="h-24 w-full bg-white/5" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-20 w-full bg-white/5" />
                    <Skeleton className="h-20 w-full bg-white/5" />
                    <Skeleton className="h-20 w-full bg-white/5" />
                  </div>
                </div>
              </Card>
            ) : isError ? (
              <Card className="p-8 bg-destructive/10 border-destructive/30 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                  <p className="text-[#e8e0f5]">Impossible de lire les astres pour le moment. Veuillez réessayer plus tard.</p>
                </div>
              </Card>
            ) : horoscope ? (
              <Card className="p-6 md:p-8 bg-card/80 border-[#7c5cbf]/30 backdrop-blur relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 text-9xl opacity-[0.03] pointer-events-none">
                  {horoscope.emoji || ZODIAC_SIGNS.find(s => s.id === selectedSign)?.symbol}
                </div>
                
                <div className="relative z-10 space-y-8">
                  <header className="border-b border-white/10 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-2xl text-[#d4a843]">
                        {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name}
                      </h3>
                      <span className="text-sm text-[#a89bc4] font-mono">{horoscope.date}</span>
                    </div>
                  </header>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-[#e8e0f5] font-light">
                      {horoscope.message}
                    </p>
                  </div>

                  {horoscope.domains && horoscope.domains.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      {horoscope.domains.map((domain, i) => (
                        <div key={i} className="bg-background/50 rounded-lg p-4 border border-white/5 flex items-center gap-4">
                          <div className="p-2 bg-white/5 rounded-md">
                            {getDomainIcon(domain.label)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#e8e0f5]">{domain.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full w-20 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#7c5cbf] to-[#d4a843]" 
                                  style={{ width: `${domain.score}%` }}
                                />
                              </div>
                              <span className="text-xs text-[#a89bc4] font-mono">{domain.score}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
