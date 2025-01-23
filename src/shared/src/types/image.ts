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
