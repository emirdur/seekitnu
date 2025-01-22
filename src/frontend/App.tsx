import { BrowserRouter } from "react-router-dom";
import AuthProvider, { useAuth } from "./src/contexts/AuthContext"; // Import the context hook
import { Loader } from "./src/components/Loader/Loader";
import { ImageUploadProvider } from "./src/contexts/ImageUploadContext";
import { AppRoutes } from "./src/routes/AppRoutes";
import { ToastProvider } from "./src/contexts/ToastContext";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ImageUploadProvider>
            <AppRoutes />
          </ImageUploadProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
