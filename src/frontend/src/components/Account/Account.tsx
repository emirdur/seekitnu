import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap"; // Import Modal from react-bootstrap
import "./Account.css"; // Import the CSS file

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLeaderboardClick = () => {
    setIsModalVisible(true); // Show modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close modal
  };

  return (
    <div className="account-container">
      <button className="back-button" onClick={handleBackClick}>
        ←
      </button>
      <div className="content">
        <h1>41 wins • #256</h1>
        <h2>Username</h2>
        <h4 onClick={handleLeaderboardClick}>Leaderboard</h4>
        <h4>Change Credentials</h4>
        <h4>Privacy Policy</h4>
        <h4>Sign Out</h4>
      </div>

      {/* React-Bootstrap Modal for Leaderboard */}
      <Modal
        show={isModalVisible}
        onHide={closeModal}
        centered
        size="lg"
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Leaderboard</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <p>1. Username</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Account;
