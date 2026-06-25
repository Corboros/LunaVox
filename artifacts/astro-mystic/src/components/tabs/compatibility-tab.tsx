import { useState, useRef } from "react";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { useGetCompatibility, getGetCompatibilityQueryKey, useGetCompatibilityUsage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Heart, AlertCircle, Crown, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CompatibilityTab() {
  const [sign1, setSign1] = useState<string>("");
  const [sign2, setSign2] = useState<string>("");
  const [calculate, setCalculate] = useState(false);

  const { data: usage, isLoading: loadingUsage } = useGetCompatibilityUsage();

  const { data: compatibility, isLoading, error } = useGetCompatibility(
    { sign1, sign2 },
    {
      query: {
        enabled: !!sign1 && !!sign2 && calculate,
        queryKey: getGetCompatibilityQueryKey({ sign1, sign2 }),
        retry: false,
      }
    }
  );

  const handleCalculate = () => {
    if (sign1 && sign2) {
      setCalculate(true);
    }
  };

  const isPaymentRequired = error?.response?.status === 402;

  const reset = () => {
    setCalculate(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-3xl md:text-4xl text-white">Compatibilité Astrale</h2>
        <p className="text-[#a89bc4]">Découvrez l'harmonie cosmique entre deux signes.</p>
      </div>

      {!calculate ? (
        <Card className="p-6 md:p-10 bg-card/80 border-[#7c5cbf]/30 backdrop-blur">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
            
            {/* Sign 1 */}
            <div className="flex-1 w-full space-y-4 text-center">
              <label className="text-sm font-medium text-[#e8e0f5]">Votre signe</label>
              <Select value={sign1} onValueChange={setSign1}>
                <SelectTrigger className="h-16 bg-background border-[#7c5cbf]/40 text-lg">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{s.symbol}</span>
                        {s.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex items-center justify-center p-4 bg-white/5 rounded-full border border-white/10 shrink-0">
              <X className="w-6 h-6 text-[#a89bc4]" />
            </div>

            {/* Sign 2 */}
            <div className="flex-1 w-full space-y-4 text-center">
              <label className="text-sm font-medium text-[#e8e0f5]">Leur signe</label>
              <Select value={sign2} onValueChange={setSign2}>
                <SelectTrigger className="h-16 bg-background border-[#7c5cbf]/40 text-lg">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{s.symbol}</span>
                        {s.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center space-y-4">
            <Button 
              onClick={handleCalculate}
              disabled={!sign1 || !sign2}
              size="lg" 
              className="w-full md:w-auto bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white font-serif px-12 h-14 shadow-lg shadow-[#7c5cbf]/20"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Calculer la compatibilité
            </Button>

            {!loadingUsage && usage && (
              <div className="text-sm text-[#a89bc4] flex items-center gap-2">
                {usage.isPremium ? (
                  <Badge variant="outline" className="border-[#d4a843] text-[#d4a843] bg-[#d4a843]/10">
                    <Crown className="w-3 h-3 mr-1" /> Premium: Illimité
                  </Badge>
                ) : (
                  <span>
                    {usage.freeTestUsed ? "Votre test gratuit a été utilisé." : "Vous avez 1 test gratuit disponible."}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            {isLoading ? (
              <Card className="p-10 bg-card/80 border-[#7c5cbf]/30 backdrop-blur text-center space-y-6">
                <Heart className="w-12 h-12 text-[#7c5cbf] animate-ping mx-auto" />
                <p className="text-[#a89bc4] font-serif text-lg animate-pulse">Alignement des planètes en cours...</p>
              </Card>
            ) : isPaymentRequired ? (
              <Card className="p-8 md:p-12 bg-card/90 border-[#d4a843]/40 backdrop-blur text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#d4a843]/5 to-transparent pointer-events-none" />
                <div className="mx-auto w-16 h-16 bg-[#d4a843]/20 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-[#d4a843]" />
                </div>
                <h3 className="font-serif text-3xl text-white">Le cosmos exige une offrande</h3>
                <p className="text-[#e8e0f5] max-w-lg mx-auto text-lg leading-relaxed">
                  Vous avez déjà utilisé votre lecture de compatibilité gratuite. Devenez Premium pour débloquer des analyses illimitées.
                </p>
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={reset} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    Retour
                  </Button>
                </div>
              </Card>
            ) : error ? (
              <Card className="p-8 bg-destructive/10 border-destructive/30 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                  <p className="text-[#e8e0f5]">Une erreur s'est produite. Les astres sont voilés.</p>
                  <Button onClick={reset} variant="link" className="text-white mt-4">Essayer à nouveau</Button>
                </div>
              </Card>
            ) : compatibility ? (
              <Card className="p-6 md:p-10 bg-card/80 border-[#7c5cbf]/30 backdrop-blur relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7c5cbf]/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  
                  <div className="flex items-center justify-center gap-6 mb-8 w-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-background rounded-full border border-[#7c5cbf]/40 flex items-center justify-center text-4xl mb-2 mx-auto">
                        {ZODIAC_SIGNS.find(s => s.id === compatibility.sign1)?.symbol}
                      </div>
                      <span className="text-sm font-medium text-[#e8e0f5]">{ZODIAC_SIGNS.find(s => s.id === compatibility.sign1)?.name}</span>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <span className="text-4xl font-serif text-[#d4a843] mb-1">{compatibility.overallScore}%</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#a89bc4]">Compatibilité</span>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-background rounded-full border border-[#7c5cbf]/40 flex items-center justify-center text-4xl mb-2 mx-auto">
                        {ZODIAC_SIGNS.find(s => s.id === compatibility.sign2)?.symbol}
                      </div>
                      <span className="text-sm font-medium text-[#e8e0f5]">{ZODIAC_SIGNS.find(s => s.id === compatibility.sign2)?.name}</span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-center mb-10">
                    <p className="text-lg leading-relaxed text-[#e8e0f5] italic font-serif">
                      "{compatibility.message}"
                    </p>
                  </div>

                  {compatibility.domains && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {compatibility.domains.map((domain, i) => (
                        <div key={i} className="bg-background/40 p-4 rounded-lg border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-[#e8e0f5]">{domain.label}</span>
                            <span className="text-sm text-[#d4a843]">{domain.score}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#7c5cbf] to-[#d4a843] rounded-full" 
                              style={{ width: `${domain.score}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-10">
                    <Button onClick={reset} variant="outline" className="border-white/20 text-[#e8e0f5] hover:bg-white/5 hover:text-white">
                      Faire un autre test
                    </Button>
                  </div>

                </div>
              </Card>
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
