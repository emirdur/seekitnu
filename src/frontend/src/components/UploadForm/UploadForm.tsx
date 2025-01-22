import { Button, Container, Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";
import { TaskComponent } from "../TaskComponent/TaskComponent";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useImageUpload } from "../../contexts/ImageUploadContext";
import "./UploadForm.css";
import { useToast } from "../../contexts/ToastContext";

export const UploadForm = () => {
  const { user } = useAuth();
  const { setHasUploadedImage } = useImageUpload();
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        setSelectedFile(file);
      } else {
        showToast("Only image files are allowed.", "danger");
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
        setSelectedFile(file);
      } else {
        showToast("Only image files are allowed.", "danger");
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!user) {
      showToast("You must be logged in to upload an image.", "danger");
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
        showToast("Upload failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Error uploading file. Please try again.", "danger");
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
    </Container>
  );
};
