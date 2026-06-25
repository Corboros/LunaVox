import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { useGetUserProfile, useUpdateUserProfile, useGetSubscriptionStatus } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Save, MoonStar } from "lucide-react";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

export default function ProfileTab() {
  const { user } = useUser();
  const { toast } = useToast();
  
  const { data: profile, isLoading } = useGetUserProfile();
  const { data: subStatus } = useGetSubscriptionStatus();
  const updateProfile = useUpdateUserProfile();

  const [formData, setFormData] = useState({ name: "", zodiacSign: "", birthDate: "" });
  const initRef = useRef<string | null>(null);

  useEffect(() => {
    if (profile && initRef.current !== profile.userId) {
      setFormData({
        name: profile.name || user?.fullName || "",
        zodiacSign: profile.zodiacSign || "",
        birthDate: profile.birthDate || "",
      });
      initRef.current = profile.userId;
    }
  }, [profile, user]);

  const handleSave = () => {
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations astrales ont été sauvegardées.",
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder votre profil.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-40 w-full rounded-xl bg-white/5" />
        <Skeleton className="h-64 w-full rounded-xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* Identity Card */}
      <Card className="bg-card/50 border-white/5 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#1a1230] to-[#2d1b4e] relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] opacity-20 bg-cover mix-blend-screen" />
        </div>
        <CardContent className="pt-0 relative px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-6">
            <Avatar className="w-24 h-24 border-4 border-background bg-card">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-2xl">{user.firstName?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-serif text-white">{user.fullName}</h2>
              <p className="text-[#a89bc4] text-sm">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div className="shrink-0 pb-2">
              {subStatus?.isPremium ? (
                <Badge variant="outline" className="border-[#d4a843] text-[#d4a843] bg-[#d4a843]/10 px-3 py-1">
                  <Crown className="w-4 h-4 mr-2" /> Premium
                </Badge>
              ) : (
                <Badge variant="outline" className="border-white/20 text-[#a89bc4] bg-background/50">
                  Membre Standard
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="bg-card/80 border-[#7c5cbf]/20 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center gap-2 text-white">
            <MoonStar className="w-5 h-5 text-[#7c5cbf]" />
            Empreinte Astrale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#e8e0f5]">Nom spirituel</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-background border-white/10 focus-visible:ring-[#7c5cbf] text-white"
                placeholder="Votre nom"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#e8e0f5]">Date de naissance</label>
              <Input 
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="bg-background border-white/10 focus-visible:ring-[#7c5cbf] text-white [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-[#e8e0f5]">Signe du Zodiaque</label>
              <Select value={formData.zodiacSign} onValueChange={(v) => setFormData({...formData, zodiacSign: v})}>
                <SelectTrigger className="bg-background border-white/10 focus-visible:ring-[#7c5cbf] text-white">
                  <SelectValue placeholder="Sélectionnez votre signe" />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{s.symbol}</span> {s.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Link href="/app/become-consultant">
              <Button variant="link" className="text-[#7c5cbf] hover:text-white px-0">
                Devenir consultant
              </Button>
            </Link>
            <Button 
              onClick={handleSave} 
              disabled={updateProfile.isPending}
              className="bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white"
            >
              {updateProfile.isPending ? <span className="animate-pulse">Génération...</span> : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
      
    </div>
  );
}
