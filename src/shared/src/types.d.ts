export interface InputFieldProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SubmitButtonProps {
  label: string; // Text to display on the button
  variant: "login" | "signup"; // Ensures only valid variants
  onClick: () => void; // Function triggered on click
}

export interface CustomToastProps {
  label: string;
  styles?: string | React.CSSProperties;
}

export interface DisplayTextProps {
  text: string;
  styles?: string | React.CSSProperties;
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

export interface HorizontalLineWithWordProps {
  text: string;
}

export interface User {
  username: string;
  email: string;
  profilePicture: string;
}

export interface Image {
  url: string;
}

export interface ImageCardProps {
  user?: User;
  image: Image;
}

// ------------------------------------------------------------------
// Auth Interface
// ------------------------------------------------------------------
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues extends LoginFormValues {
  username: string;
}
