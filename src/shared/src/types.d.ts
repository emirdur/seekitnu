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

export interface HorizontalLineWithWordProps {
  text: string;
}

export interface User {
  username: string;
  email: string;
}

export interface Image {
  url: string;
}

export interface ImageCardProps {
  user?: User;
  image: Image;
}


// -----------------------------------------------------------------
// Card Grid Interface
// -----------------------------------------------------------------
interface CardData {
  id: number;
  username: string;
  imageUrl: string;
  likes: number;
}
