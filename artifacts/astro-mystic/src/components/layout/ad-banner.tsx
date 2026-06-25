import { useGetSubscriptionStatus } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Crown } from "lucide-react";

type AdBannerProps = {
  slot?: "leaderboard" | "rectangle" | "banner";
};

export function AdBanner({ slot = "leaderboard" }: AdBannerProps) {
  const { data: status } = useGetSubscriptionStatus();

  if (status?.isPremium) return null;

  const sizes: Record<string, { w: string; h: string; label: string }> = {
    leaderboard: { w: "w-full max-w-2xl mx-auto", h: "h-24", label: "728×90" },
    rectangle:   { w: "w-full max-w-sm mx-auto", h: "h-64", label: "300×250" },
    banner:      { w: "w-full max-w-2xl mx-auto", h: "h-16", label: "468×60" },
  };

  const { w, h, label } = sizes[slot];

  return (
    <div className={`${w} my-4`} data-testid={`ad-banner-${slot}`}>
      {/* ── Replace the block below with your real ad code (Google AdSense, etc.) ── */}
      <div
        className={`${h} relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] overflow-hidden group`}
      >
        {/* Subtle background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent" />

        <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1 font-mono">
          Publicité · {label}
        </p>

        {/* Placeholder ad content — replace with real ad tag */}
        <p className="text-xs text-white/30 italic">
          Espace publicitaire disponible
        </p>

        {/* Upgrade nudge */}
        <Link href="/app" className="mt-2 flex items-center gap-1 text-[10px] text-[#d4a843]/60 hover:text-[#d4a843] transition-colors">
          <Crown className="w-3 h-3" />
          Passer Premium pour supprimer les pubs
        </Link>
      </div>
      {/* ── End ad placeholder ── */}
    </div>
  );
}
