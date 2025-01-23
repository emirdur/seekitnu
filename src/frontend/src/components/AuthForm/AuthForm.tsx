import React from "react";
import { AuthFormProps } from "../../../../shared/src/types/authTypes";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export const AuthForm: React.FC<AuthFormProps> = ({
  authType,
  setAuthType,
}) => {
  return (
    <>
      {authType === "login" ? (
        <LoginForm setAuthType={setAuthType} />
      ) : (
        <SignUpForm setAuthType={setAuthType} />
      )}
    </>
  );
};
