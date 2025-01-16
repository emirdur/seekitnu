import React from "react";
import { CardGrid } from "../CardGrid/CardGrid";
import "./HomeComponent.css";
import { Search } from "../Search/Search";

export const HomeComponent: React.FC = () => {
  return (
    <div className="home-container">
      <header className="navbar rounded shadow-sm">
        <h1 className="logo">SeekIt</h1>
        <Search />
        <h6 className="my-account">My Account</h6>
      </header>
      <main className="container py-4">
        <CardGrid />
      </main>
    </div>
  );
};
