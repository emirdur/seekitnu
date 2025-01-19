import React, { useState } from "react";
import "./Search.css"; // Optional: Separate styles for SearchBar

interface SearchProps {
  placeholder?: string; // Allow passing a placeholder as a prop
  onSearch: (searchTerm: string) => void; // Prop to handle search term change
}

export const Search: React.FC<SearchProps> = ({
  placeholder = "Search",
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass the search term to parent component
  };

  return (
    <input
      type="text"
      className="form-control search-bar"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
};
