import { useState } from "react";

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // useEffect(() => {}, [])
  // Two parameters: function and dependency array
  // Pass in any states that you want in the dependency array if you want that thing to be called when a state changes
  // If dependency array is blank then it will only be called once when that component renders

  return (
    <>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
      </form>
    </>
  );
};
