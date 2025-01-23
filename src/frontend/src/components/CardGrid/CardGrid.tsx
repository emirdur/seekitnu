import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { Modal } from "react-bootstrap";
import "./CardGrid.css";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { CardData, CardGridProps } from "../../../../shared/src/types/card";

export const CardGrid: React.FC<CardGridProps> = ({ searchTerm }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { showToast } = useToast();

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
        showToast("Error fetching images.", "danger");
        setLoading(false);
      }
    };

    const fetchUserLikes = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/images/${user.uid}/likes`, // Pass the firebase UID
        );
        const likedImageIds = await response.json();

        const likedState = likedImageIds.reduce(
          (acc: { [key: number]: boolean }, imageId: number) => {
            acc[imageId] = true;
            return acc;
          },
          {},
        );

        setLikedCards(likedState);
      } catch (error) {
        showToast("Error fetching like count.", "danger");
      }
    };

    fetchImages();
    fetchUserLikes();
  }, []);

  const toggleLike = async (id: number) => {
    if (!user?.uid) {
      return;
    }

    const isLiked = likedCards[id];

    // Optimistically update UI
    setLikedCards((prevState) => ({ ...prevState, [id]: !isLiked }));
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? { ...card, likes: card.likes + (isLiked ? -1 : 1) }
          : card,
      ),
    );

    try {
      // Send a request to toggle the like, passing firebaseUid instead of userId
      const response = await fetch(
        `http://localhost:5000/api/images/${id}/toggleLike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseUid: user.uid }), // Pass the firebase UID here
        },
      );

      if (!response.ok) {
        showToast("Error liking image.", "danger");
      }
    } catch (error) {
      showToast("Liked image state won't be saved.", "warning");
      // Roll back the optimistic update in case of an error
      setLikedCards((prevState) => ({ ...prevState, [id]: isLiked }));
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id
            ? { ...card, likes: card.likes + (isLiked ? 1 : -1) }
            : card,
        ),
      );
    }
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const filteredCards = cards.filter((card) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      card.username.toLowerCase().includes(searchTermLower) ||
      card.imageUrl.toLowerCase().includes(searchTermLower)
    );
  });

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
        {filteredCards.map((card) => (
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
