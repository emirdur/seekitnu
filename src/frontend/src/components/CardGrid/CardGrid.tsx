import React, { useState } from "react";
import Masonry from "react-masonry-css";
import { Modal } from "react-bootstrap";
import "./CardGrid.css";
import { CardData } from "../../../../shared/src/types";

const mockData: CardData[] = [
  { id: 1, username: "seeker", imageUrl: "src/assets/cat.jpg", likes: 10 },
  { id: 2, username: "seeker", imageUrl: "src/assets/cam.jpg", likes: 25 },
  { id: 3, username: "seeker", imageUrl: "src/assets/test.jpg", likes: 5 },
  { id: 4, username: "seeker", imageUrl: "src/assets/cat.jpg", likes: 10 },
  { id: 5, username: "seeker", imageUrl: "src/assets/cam.jpg", likes: 25 },
  { id: 6, username: "seeker", imageUrl: "src/assets/test.jpg", likes: 5 },
  { id: 7, username: "seeker", imageUrl: "src/assets/light.jpg", likes: 27 },
  { id: 8, username: "seeker", imageUrl: "src/assets/clouds.jpg", likes: 36 },
];

export const CardGrid: React.FC = () => {
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleLike = (id: number) => {
    setLikedCards((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  // Masonry breakpoints
  const breakpointColumns = {
    default: 4, // Number of columns for large screens
    1100: 3, // Number of columns for medium screens
    768: 2, // Number of columns for small screens
    576: 1, // Number of columns for extra small screens
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {mockData.map((card) => (
          <div className="custom-card position-relative" key={card.id}>
            <img
              src={card.imageUrl}
              alt="Card content"
              className="img-fluid rounded"
              onClick={() => openImage(card.imageUrl)}
              style={{ cursor: "pointer" }}
            />
            <div className="overlay d-flex flex-column align-items-start p-1">
              <span className="text-light fw-bold">{card.username}</span>
              <div
                className="like-container d-flex align-items-center mt-auto"
                onClick={() => toggleLike(card.id)}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={`bi ${
                    likedCards[card.id]
                      ? "bi-star-fill text-warning"
                      : "bi-star text-light"
                  } fs-4`}
                ></i>
                <span className="text-light ms-2">
                  {likedCards[card.id] ? card.likes + 1 : card.likes}
                </span>
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
