import { Button, Container, Toast, ToastContainer } from "react-bootstrap";
import { useState, useEffect } from "react";
import { TaskComponent } from "../TaskComponent/TaskComponent";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useImageUpload } from "../../contexts/ImageUploadContext";
import "./UploadForm.css";

export const UploadForm = () => {
  const { user } = useAuth(); // Get the authenticated user
  const { hasUploadedImage, setHasUploadedImage } = useImageUpload(); // Get upload status and function

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heif",
  ];

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (validImageTypes.includes(file.type)) {
        setToastMessage(null);
        setShowToast(false);
        setSelectedFile(file);
      } else {
        setToastMessage("Only image files are allowed.");
        setShowToast(true);
        setSelectedFile(null);
      }
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (validImageTypes.includes(file.type)) {
        setToastMessage(null);
        setShowToast(false);
        setSelectedFile(file);
      } else {
        setToastMessage("Only image files are allowed.");
        setShowToast(true);
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!user) {
      setToastMessage("You must be logged in to upload an image.");
      setShowToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("userId", user.uid); // Add userId to form data

    try {
      const response = await axios.post(
        "http://localhost:5000/api/images/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.status === "success") {
        setHasUploadedImage(true); // Update context to indicate image uploaded
      } else {
        setToastMessage("Upload failed. Please try again.");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setToastMessage("Error uploading file. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <Container className="upload-container d-flex flex-column align-items-center justify-content-center">
      <TaskComponent></TaskComponent>
      <div
        className="upload-box"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!selectedFile ? (
          <>
            <p className="upload-text">Drag & Drop</p>
            <p className="upload-or">or</p>
          </>
        ) : (
          <p className="uploaded-file-name">{selectedFile.name}</p>
        )}

        {/* Button and label trigger the same onClick handler */}
        <Button
          className="custom-browse-button"
          onClick={() => document.getElementById("file-input")?.click()}
          style={{ cursor: "pointer" }}
        >
          Browse Images
        </Button>

        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          className="custom-file-input"
          accept="image/*"
          onChange={handleFileSelection}
          style={{ display: "none" }}
        />
      </div>

      {/* Conditionally render Submit button when a file is selected */}
      {selectedFile && (
        <Button className="custom-submit-button mt-3" onClick={handleSubmit}>
          Upload
        </Button>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="danger"
          style={{ width: "250px" }}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};
