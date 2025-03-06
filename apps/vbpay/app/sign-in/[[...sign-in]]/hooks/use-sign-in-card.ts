import { useState } from "react";
import { type SignInOutput } from "aws-amplify/auth";
import { useTheme } from "next-themes";

export function useSignInCard() {
  const [currentState, setCurrentState] = useState<SignInOutput | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { theme } = useTheme();

  return {
    theme,
    currentState,
    setCurrentState,
    email,
    setEmail,
  };
}
