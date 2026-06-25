import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useClerk } from "@clerk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Star, Users, Crown, User, LogOut } from "lucide-react";
import { Particles } from "@/components/layout/particles";

import HoroscopeTab from "@/components/tabs/horoscope-tab";
import CompatibilityTab from "@/components/tabs/compatibility-tab";
import ConsultantsTab from "@/components/tabs/consultants-tab";
import PremiumTab from "@/components/tabs/premium-tab";
import ProfileTab from "@/components/tabs/profile-tab";

const TABS = [
  { id: "horoscope", label: "Horoscope", icon: Star },
  { id: "compatibility", label: "Compatibilité", icon: Moon },
  { id: "consultants", label: "Consultants", icon: Users },
  { id: "premium", label: "Premium", icon: Crown },
  { id: "profile", label: "Mon Profil", icon: User },
];

export default function AppShell() {
  const [activeTab, setActiveTab] = useState("horoscope");
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleSignOut = () => {
    signOut({ redirectUrl: basePath || "/" });
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative flex flex-col">
      <Particles />
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] bg-cover bg-center opacity-[0.05] mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-[#d4a843]" />
            <span className="font-serif text-xl font-bold tracking-widest text-white">AstroMystic</span>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-[#a89bc4] hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-1 py-2 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-[#a89bc4] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive && tab.id === "premium" ? "text-[#d4a843]" : ""}`} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 border border-[#7c5cbf]/50 bg-[#7c5cbf]/10 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "horoscope" && <HoroscopeTab />}
            {activeTab === "compatibility" && <CompatibilityTab />}
            {activeTab === "consultants" && <ConsultantsTab />}
            {activeTab === "premium" && <PremiumTab />}
            {activeTab === "profile" && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
