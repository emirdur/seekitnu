import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { Modal } from "react-bootstrap";
import "./CardGrid.css";

type CardData = {
  id: number;
  username: string;
  imageUrl: string;
  likes: number;
};

export const CardGrid: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/images/retrieveImages",
        ); // Replace with your actual endpoint
        const data: CardData[] = await response.json();
        setCards(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const toggleLike = async (id: number) => {
    const isLiked = likedCards[id]; // Check current like status

    try {
      const response = await fetch(
        `http://localhost:5000/api/images/${id}/toggleLike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ like: !isLiked }), // Send the opposite of the current state
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update like count");
      }

      const data = await response.json();

      // Update the state with the new like count
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, likes: data.likes } : card,
        ),
      );

      // Toggle the local like state
      setLikedCards((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    768: 2,
    576: 1,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {cards.map((card) => (
          <div className="custom-card position-relative" key={card.id}>
            <img
              src={`http://localhost:5000/uploads/${card.imageUrl}`} // Correct string interpolation
              alt="Card content"
              className="img-fluid rounded"
              onClick={
                () =>
                  openImage(`http://localhost:5000/uploads/${card.imageUrl}`) // Correct string interpolation
              }
              style={{ cursor: "pointer" }}
            />

            <div className="overlay d-flex flex-column align-items-start p-1">
              <span className="text-light fw-bold">{card.username}</span>
              <div
                className="like-container d-flex align-items-center mt-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(card.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={`bi ${
                    likedCards[card.id]
                      ? "bi-star-fill text-warning"
                      : "bi-star text-light"
                  } fs-4`}
                ></i>
                <span className="text-light ms-2">{card.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </Masonry>

      <Modal
        show={!!selectedImage}
        onHide={closeImage}
        centered
        size="lg"
        className="custom-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="p-0">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Expanded view"
              className="img-fluid"
            />
          ) : (
            <p>No image selected</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
