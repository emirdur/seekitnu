import { useState } from "react";
import { AuthForm } from "../components/AuthForm/AuthForm";

export function Auth() {
  const [authType, setAuthType] = useState<"login" | "signup">("login");

  return (
    <>
      <AuthForm authType={authType} setAuthType={setAuthType} />
    </>
  );
}
