import React from "react";
import "./Search.css"; // Optional: Separate styles for SearchBar

interface SearchProps {
  placeholder?: string; // Allow passing a placeholder as a prop
}

export const Search: React.FC<SearchProps> = ({ placeholder = "Search" }) => {
  return (
    <input
      type="text"
      className="form-control search-bar"
      placeholder={placeholder}
    />
  );
};
