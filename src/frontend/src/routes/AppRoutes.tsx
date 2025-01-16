import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Auth } from "../pages/Auth";
import { Home } from "../pages/Home";
import { Upload } from "../pages/Upload";

export const AppRoutes = () => {
  const { user, hasUploadedImage } = useAuth();

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
