import { useListConsultants, useGetFeaturedConsultants } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Crown, MessageCircle, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { Link } from "wouter";

export default function ConsultantsTab() {
  const { data: consultants, isLoading } = useListConsultants();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedConsultants();

  return (
    <div className="space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-white">Nos Consultants</h2>
        <p className="text-[#a89bc4]">Échangez avec des experts en astrologie, tarologie et numérologie pour éclairer votre chemin.</p>
      </div>

      {featuredLoading || isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card/50 border-white/5 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-full bg-white/5" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4 bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-20 w-full bg-white/5" />
              <Skeleton className="h-10 w-full rounded-md bg-white/5" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Consultants */}
          {featured && featured.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#d4a843]">
                <Crown className="w-5 h-5" />
                <h3 className="font-serif text-xl">Consultants Recommandés</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map(c => <ConsultantCard key={c.id} consultant={c} isFeatured />)}
              </div>
            </div>
          )}

          {/* All Consultants */}
          {consultants && consultants.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl text-white">Tous les experts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultants.filter(c => !featured?.find(f => f.id === c.id)).map(c => (
                  <ConsultantCard key={c.id} consultant={c} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!consultants || consultants.length === 0) && (!featured || featured.length === 0) && (
            <div className="text-center py-16 text-[#a89bc4]">
              <Crown className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun consultant disponible pour le moment.</p>
            </div>
          )}
        </div>
      )}

      {/* Become a Consultant CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-[#7c5cbf]/30 bg-gradient-to-br from-[#1a1230] via-background to-[#0d0a1a] p-8 text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, #7c5cbf 0%, transparent 70%)" }} />
        <Sparkles className="w-8 h-8 text-[#d4a843] mx-auto mb-4 opacity-80" />
        <h3 className="font-serif text-2xl text-white mb-2">Vous avez un don à partager ?</h3>
        <p className="text-[#a89bc4] mb-6 max-w-md mx-auto">
          Rejoignez notre cercle de praticiens et guidez les âmes en quête de réponses.
        </p>
        <Link href="/app/become-consultant">
          <Button
            data-testid="button-become-consultant"
            className="bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white px-8 h-12 font-serif text-base shadow-lg shadow-[#7c5cbf]/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Devenir consultant
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ConsultantCard({ consultant, isFeatured = false }: { consultant: any, isFeatured?: boolean }) {
  const zodiacInfo = consultant.zodiacSign ? ZODIAC_SIGNS.find(s => s.id === consultant.zodiacSign) : null;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isFeatured ? 'bg-gradient-to-b from-[#1a1230] to-background border-[#d4a843]/30 shadow-[0_5px_20px_rgba(212,168,67,0.05)]' : 'bg-card/50 border-white/5 hover:border-[#7c5cbf]/50'}`}>
      <CardContent className="p-6 relative h-full flex flex-col">
        {isFeatured && (
          <div className="absolute top-0 right-0 p-3">
            <Crown className="w-5 h-5 text-[#d4a843] opacity-50" />
          </div>
        )}
        
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16 border-2 border-[#7c5cbf]/30">
            <AvatarImage src={consultant.avatar || ""} />
            <AvatarFallback className="bg-[#7c5cbf]/20 text-[#e8e0f5] text-lg font-serif">
              {consultant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-lg text-white font-bold truncate">{consultant.name}</h4>
            <p className="text-sm text-[#7c5cbf] font-medium">{consultant.speciality}</p>
            
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#a89bc4]">
              {consultant.rating ? (
                <span className="flex items-center text-[#d4a843]">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  {consultant.rating.toFixed(1)} <span className="text-[#a89bc4] ml-1">({consultant.reviewCount || 0})</span>
                </span>
              ) : (
                <span className="text-muted-foreground italic">Nouveau</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-[#e8e0f5] line-clamp-3 mb-6 flex-1 opacity-80 leading-relaxed">
          {consultant.bio}
        </p>

        <div className="space-y-4 mt-auto">
          <div className="flex flex-wrap gap-2">
            {zodiacInfo && (
              <Badge variant="outline" className="bg-background/50 border-white/10 text-xs">
                {zodiacInfo.symbol} {zodiacInfo.name}
              </Badge>
            )}
            {consultant.experience && (
              <Badge variant="outline" className="bg-background/50 border-white/10 text-xs text-[#a89bc4]">
                {consultant.experience} exp
              </Badge>
            )}
            {consultant.tags && consultant.tags.slice(0,2).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-[#7c5cbf]/10 text-[#c8baec] text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="text-sm font-medium">
              <span className="text-white text-lg">{consultant.pricePerSession ? `${consultant.pricePerSession}€` : 'Gratuit'}</span>
              <span className="text-[#a89bc4] text-xs font-normal"> / session</span>
            </div>
            <Button size="sm" className="bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Réserver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
