import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home } from "../pages/Home";
import { Upload } from "../pages/Upload";
import { Auth } from "../pages/Auth";
import { useImageUpload } from "../contexts/ImageUploadContext";
import { Loader } from "../components/Loader/Loader";
import { useEffect, useState } from "react";
import Account from "../components/Account/Account";

export const AppRoutes = () => {
  const { user } = useAuth(); // Get the authenticated user
  const { hasUploadedImage, checkIfImageUploaded } = useImageUpload(); // Get upload status and function
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkIfImageUploaded(user.uid).finally(() => {
        setLoading(false); // Stop loading after the check
      });
    } else {
      setLoading(false); // Stop loading if no user
    }
  }, [user, checkIfImageUploaded]);

  if (loading) {
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
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </>
      )}
    </Routes>
  );
};
