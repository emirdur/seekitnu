import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home } from "../pages/Home";
import { Upload } from "../pages/Upload";
import { Auth } from "../pages/Auth";
import { useImageUpload } from "../contexts/ImageUploadContext";
import { Loader } from "../components/Loader/Loader";
import { useEffect } from "react";

export const AppRoutes = () => {
  const { user } = useAuth(); // Get the authenticated user
  const { hasUploadedImage, checkIfImageUploaded } = useImageUpload(); // Get upload status and function

  // Check if image is uploaded when user is authenticated
  useEffect(() => {
    if (user && hasUploadedImage === null) {
      checkIfImageUploaded(user.uid); // Trigger image upload check
    }
  }, [user, hasUploadedImage, checkIfImageUploaded]);

  // Display a loader while checking if the image is uploaded
  if (user && hasUploadedImage === null) {
    return <Loader />;
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : !hasUploadedImage ? (
        <>
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </>
      ) : (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </>
      )}
    </Routes>
  );
};
