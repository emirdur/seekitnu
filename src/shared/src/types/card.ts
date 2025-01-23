export interface CardData {
  id: number;
  username: string;
  imageUrl: string;
  likes: number;
}

export interface CardGridProps {
  searchTerm: string;
}
