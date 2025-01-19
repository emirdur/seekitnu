import { User } from "firebase/auth"; // Firebase User type

export interface IAuth {
  user: User | null;
  loading: boolean;
  signIn: (creds: LoginFormValues) => void;
  signUp: (creds: UserFormValues) => void;
  signOut: () => void;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastMessage: string;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
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
