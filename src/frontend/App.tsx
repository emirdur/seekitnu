import { BrowserRouter } from "react-router-dom";

import AuthProvider, { useAuth } from "./src/contexts/AuthContext"; // Import the context hook
import { Loader } from "./src/components/Loader/Loader";
import { AppRoutes } from "./src/routes/AppRoutes";

const App = () => {
  const { user, hasUploadedImage, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
