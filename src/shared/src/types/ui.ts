export interface InputFieldProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SubmitButtonProps {
  label: string;
  variant: "login" | "signup";
  onClick: () => void;
}

export interface CustomToastProps {
  label: string;
  styles?: string | React.CSSProperties;
}

export interface DisplayTextProps {
  text: string;
  styles?: string | React.CSSProperties;
}

export interface HorizontalLineWithWordProps {
  text: string;
}

export interface SearchProps {
  placeholder?: string; // Allow passing a placeholder as a prop
  onSearch: (searchTerm: string) => void; // Prop to handle search term change
}

export interface ToastContextProps {
  showToast: (
    message: string,
    type?: "success" | "danger" | "info" | "warning",
  ) => void;
}
