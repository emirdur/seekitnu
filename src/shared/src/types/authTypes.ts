import { User } from "firebase/auth";

export interface IAuth {
  user: User | null;
  loading: boolean;
  signIn: (creds: LoginFormValues) => void;
  signUp: (creds: UserFormValues) => void;
  signOut: () => void;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues extends LoginFormValues {
  username: string;
}

export interface AuthFormProps {
  authType: "login" | "signup";
  setAuthType: (type: "login" | "signup") => void;
}

export interface LoginFormProps {
  setAuthType: (type: "login" | "signup") => void;
}

export interface SignUpFormProps {
  setAuthType: (type: "login" | "signup") => void;
}
