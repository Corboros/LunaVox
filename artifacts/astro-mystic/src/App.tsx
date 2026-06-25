import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AppShell from "@/pages/app-shell";
import BecomeConsultant from "@/pages/become-consultant";
import CheckoutSuccess from "@/pages/checkout-success";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }: { user?: { id: string } | null }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);
  return null;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(270 45% 55%)",
    colorForeground: "hsl(270 60% 93%)",
    colorMutedForeground: "hsl(264 28% 62%)",
    colorDanger: "hsl(0 72% 51%)",
    colorBackground: "hsl(254 47% 13%)",
    colorInput: "hsl(254 47% 18%)",
    colorInputForeground: "hsl(270 60% 93%)",
    colorNeutral: "hsl(264 36% 32%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#1a1230] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[hsl(264_36%_32%)] shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-serif text-2xl text-white",
    headerSubtitle: "text-[#a89bc4]",
    socialButtonsBlockButtonText: "text-white font-medium",
    formFieldLabel: "text-[#e8e0f5]",
    footerActionLink: "text-[#7c5cbf] hover:text-white font-medium transition-colors",
    footerActionText: "text-[#a89bc4]",
    dividerText: "text-[#a89bc4]",
    identityPreviewEditButton: "text-[#7c5cbf] hover:text-white transition-colors",
    formFieldSuccessText: "text-[#a89bc4]",
    alertText: "text-white",
    logoBox: "mb-6",
    logoImage: "h-12 w-auto mx-auto",
    socialButtonsBlockButton: "border border-[hsl(264_36%_32%)] hover:bg-[hsl(254_47%_16%)] transition-colors",
    formButtonPrimary: "bg-[#7c5cbf] hover:bg-[#6a4ca3] text-white font-medium transition-colors shadow-lg shadow-[#7c5cbf]/20",
    formFieldInput: "bg-[hsl(254_47%_18%)] border-[hsl(264_36%_32%)] text-white focus:border-[#7c5cbf] focus:ring-1 focus:ring-[#7c5cbf] transition-all placeholder:text-[#a89bc4]/50",
    footerAction: "bg-transparent border-t border-[hsl(264_36%_32%)]",
    dividerLine: "bg-[hsl(264_36%_32%)]",
    alert: "bg-[hsl(0_72%_51%)/0.1] border-[hsl(0_72%_51%)]",
    otpCodeFieldInput: "bg-[hsl(254_47%_18%)] border-[hsl(264_36%_32%)] text-white",
    formFieldRow: "mb-4",
    main: "px-8 py-10",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/app" />
      </Show>
      <Show when="signed-out">
        <Landing />
      </Show>
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Revenez aux étoiles",
            subtitle: "Connectez-vous pour continuer votre voyage",
          },
        },
        signUp: {
          start: {
            title: "Commencez votre voyage",
            subtitle: "Découvrez ce que les astres vous réservent",
          },
        },
      }}
      routerPush={(to: string) => setLocation(stripBase(to))}
      routerReplace={(to: string) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            
            <Route path="/app">
              <AuthGuard>
                <AppShell />
              </AuthGuard>
            </Route>
            
            <Route path="/app/become-consultant">
              <AuthGuard>
                <BecomeConsultant />
              </AuthGuard>
            </Route>

            <Route path="/checkout-success">
              <AuthGuard>
                <CheckoutSuccess />
              </AuthGuard>
            </Route>

            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
      <Toaster />
    </WouterRouter>
  );
}

export default App;
