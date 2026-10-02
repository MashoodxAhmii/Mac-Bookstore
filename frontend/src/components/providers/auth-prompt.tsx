"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/vengeance/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthPromptContextValue {
  /** Opens the "sign in to continue" dialog. */
  promptSignIn: (message?: string) => void;
}

const AuthPromptContext = createContext<AuthPromptContextValue>({ promptSignIn: () => {} });

export function useAuthPrompt() {
  return useContext(AuthPromptContext);
}

export function AuthPromptProvider({ children }: { children: React.ReactNode }) {
  const [prompt, setPrompt] = useState<{ message: string; next: string } | null>(null);

  const promptSignIn = useCallback((text?: string) => {
    setPrompt({
      message: text ?? "Sign in to save favourites and build a cart.",
      // Read at click time so this provider does not depend on search params (which would opt the whole tree out of static rendering).
      next: encodeURIComponent(window.location.pathname + window.location.search),
    });
  }, []);
  const value = useMemo(() => ({ promptSignIn }), [promptSignIn]);
  const close = () => setPrompt(null);

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <Dialog open={prompt !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>{prompt?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" asChild onClick={close}>
              <Link href={`/sign-up?next=${prompt?.next ?? ""}`}>Create account</Link>
            </Button>
            <Button asChild onClick={close}>
              <Link href={`/sign-in?next=${prompt?.next ?? ""}`}>Sign in</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthPromptContext.Provider>
  );
}
