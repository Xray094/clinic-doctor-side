import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/profilePage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/doctors/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/doctors/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/home" element={<Navigate to="/doctors/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
