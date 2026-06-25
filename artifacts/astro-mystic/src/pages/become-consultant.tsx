import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useApplyAsConsultant, useGetMyConsultantProfile, getGetMyConsultantProfileQueryKey } from "@workspace/api-client-react";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { Particles } from "@/components/layout/particles";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SPECIALITIES = [
  "Astrologie", "Tarot", "Numérologie", "Voyance", "Médiumnité", "Cartomancie"
];

export default function BecomeConsultant() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: myProfile, isLoading: loadingProfile } = useGetMyConsultantProfile({
    query: {
      retry: false,
      queryKey: getGetMyConsultantProfileQueryKey(),
    }
  });

  const applyMutation = useApplyAsConsultant();

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    bio: "",
    zodiacSign: "",
    experience: "",
    pricePerSession: 30,
    tags: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.speciality || !formData.bio) return;

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
    };

    applyMutation.mutate({ data: payload }, {
      onSuccess: () => {
        toast({
          title: "Candidature envoyée",
          description: "Les astres étudient votre demande. Nous vous répondrons bientôt.",
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Une interférence bloque votre demande.",
          variant: "destructive"
        });
      }
    });
  };

  if (loadingProfile) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-[#a89bc4]">Consultation des registres...</div>;
  }

  // If already applied or approved
  if (myProfile || applyMutation.isSuccess) {
    const status = applyMutation.isSuccess ? "pending" : myProfile?.status;
    return (
      <div className="min-h-[100dvh] bg-background text-foreground relative flex items-center justify-center p-4">
        <Particles />
        <Card className="max-w-md w-full bg-card/80 border-[#7c5cbf]/30 backdrop-blur text-center relative z-10 p-8">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-white mb-2">Candidature Enregistrée</h2>
          <p className="text-[#a89bc4] mb-8">
            {status === "pending" 
              ? "Votre demande est en cours d'évaluation par notre conseil astral."
              : status === "approved" 
                ? "Vous êtes déjà un consultant certifié sur AstroMystic."
                : "Votre profil est actuellement enregistré."}
          </p>
          <Link href="/app">
            <Button variant="outline" className="border-white/10 text-white w-full">Retour à l'accueil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative py-12 px-4 sm:px-6">
      <Particles />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/app">
          <Button variant="ghost" className="mb-8 text-[#a89bc4] hover:text-white pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'app
          </Button>
        </Link>

        <Card className="bg-card/80 border-[#7c5cbf]/30 backdrop-blur shadow-2xl">
          <CardHeader className="text-center pb-8 border-b border-white/5">
            <div className="mx-auto w-12 h-12 bg-[#7c5cbf]/10 rounded-full flex items-center justify-center mb-4 border border-[#7c5cbf]/30">
              <Sparkles className="w-6 h-6 text-[#7c5cbf]" />
            </div>
            <CardTitle className="font-serif text-3xl text-white">Devenir Consultant</CardTitle>
            <CardDescription className="text-[#a89bc4] text-base max-w-lg mx-auto mt-2">
              Rejoignez notre cercle fermé de praticiens et guidez les âmes en quête de réponses.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#e8e0f5]">Nom complet ou spirituel *</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#e8e0f5]">Spécialité principale *</label>
                  <Select required value={formData.speciality} onValueChange={(v) => setFormData({...formData, speciality: v})}>
                    <SelectTrigger className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8e0f5]">Votre présentation (Bio) *</label>
                <Textarea 
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white resize-none"
                  placeholder="Parlez-nous de votre don, de votre approche..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#e8e0f5]">Signe (optionnel)</label>
                  <Select value={formData.zodiacSign} onValueChange={(v) => setFormData({...formData, zodiacSign: v})}>
                    <SelectTrigger className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ZODIAC_SIGNS.map(s => <SelectItem key={s.id} value={s.id}>{s.symbol} {s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#e8e0f5]">Expérience</label>
                  <Select value={formData.experience} onValueChange={(v) => setFormData({...formData, experience: v})}>
                    <SelectTrigger className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="< 1 an">Moins d'un an</SelectItem>
                      <SelectItem value="1-3 ans">1 à 3 ans</SelectItem>
                      <SelectItem value="3-5 ans">3 à 5 ans</SelectItem>
                      <SelectItem value="5-10 ans">5 à 10 ans</SelectItem>
                      <SelectItem value="10+ ans">Plus de 10 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#e8e0f5]">Tarif par session (€)</label>
                  <Input 
                    type="number"
                    min="0"
                    max="500"
                    required
                    value={formData.pricePerSession}
                    onChange={(e) => setFormData({...formData, pricePerSession: Number(e.target.value)})}
                    className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8e0f5]">Mots-clés (séparés par des virgules)</label>
                <Input 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-background/50 border-white/10 focus-visible:ring-[#7c5cbf] text-white"
                  placeholder="Avenir, Amour, Guidance spirituelle..."
                />
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={applyMutation.isPending}
                  className="w-full h-14 text-lg bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white font-serif shadow-lg shadow-[#7c5cbf]/20"
                >
                  {applyMutation.isPending ? "Transmission..." : "Soumettre ma candidature"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
