"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthBootstrap } from "@/components/providers/auth-bootstrap";
import { AuthPromptProvider } from "@/components/providers/auth-prompt";

import { GoogleOAuthProvider } from "@react-oauth/google";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 1;
        },
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "replace_me";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <MotionConfig reducedMotion="user">
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={200}>
              <AuthBootstrap />
              <AuthPromptProvider>{children}</AuthPromptProvider>
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </QueryClientProvider>
        </MotionConfig>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
