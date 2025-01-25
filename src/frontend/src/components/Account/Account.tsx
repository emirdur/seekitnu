import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "./Account.css";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [userData, setUserData] = useState<{
    wins: number;
    rank: number;
    displayName: string;
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { signOut } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (user?.uid) {
      fetch(`http://localhost:5000/api/users/${user.uid}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.exists) {
            setUserData(data.user);
          } else {
            showToast("User does not exist in the database.", "danger");
            signOut();
          }
        })
        .catch(() => showToast("Error fetching user data.", "danger"));
    }
  }, [user, showToast, signOut]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/leaderboard/retrieveLeaderboard",
      );
      const data = await response.json();
      setLeaderboard(data); // Set leaderboard state with the fetched data
    } catch (error) {
      showToast("Error fetching leaderboard.", "danger");
    }
  };

  const handleLeaderboardClick = async () => {
    setIsModalVisible(true);
    await fetchLeaderboard();
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSignOutClick = async () => {
    await signOut();
  };

  return (
    <div className="account-container">
      <button className="back-button" onClick={handleBackClick}>
        ←
      </button>
      <div className="content">
        {userData ? (
          <h1>{`${userData.wins} wins • #${userData.rank}`}</h1>
        ) : (
          <h1>Loading...</h1>
        )}
        <h2>{userData?.displayName}</h2>
        <h4 onClick={handleLeaderboardClick}>Leaderboard</h4>
        <h4>Change Credentials</h4>
        <h4>Privacy Policy</h4>
        <h4 onClick={handleSignOutClick}>Sign Out</h4>
      </div>

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
          {leaderboard.length === 0 ? (
            <p>Loading...</p>
          ) : (
            leaderboard.map((user, index) => (
              <p key={user.id}>
                {index + 1}. {user.displayName} - {user.wins} wins
              </p>
            ))
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Account;
