import React, { useState } from "react";
import { CardGrid } from "../CardGrid/CardGrid";
import { Search } from "../Search/Search";
import "./HomeComponent.css";

export const HomeComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="home-container">
      <header className="navbar rounded shadow-sm">
        <h1 className="logo">SeekIt</h1>
        <Search placeholder="Search" onSearch={handleSearch} />
        <h6 className="my-account">My Account</h6>
      </header>

      <main className="container py-4">
        <CardGrid searchTerm={searchTerm} />
      </main>
    </div>
  );
};
