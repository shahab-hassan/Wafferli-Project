// contexts/isLoginContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

const IsLoginContext = createContext<{ isLogin: boolean; setIsLogin: (v: boolean) => void } | null>(null);

export function IsLoginProvider({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <IsLoginContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </IsLoginContext.Provider>
  );
}

export function useIsLogin() {
  const ctx = useContext(IsLoginContext);
  if (!ctx) throw new Error("useIsLogin must be used inside IsLoginProvider");
  return ctx;

  
}

