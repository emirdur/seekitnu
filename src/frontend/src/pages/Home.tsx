import { ImageCard } from "../components/ImageCard/ImageCard";
import { Search } from "../components/Search/Search";

export function Home() {
  const images = [
    { id: 1, url: "./assets" },
    { id: 2, url: "./assets" },
  ];

  return (
    <div className="home">
      <div className="search">
        <Search></Search>
      </div>
      <div className="image-grid">
        {images.map((image) => (
          <ImageCard image={image} key={image.id} user={undefined} />
        ))}
      </div>
    </div>
  );
}
