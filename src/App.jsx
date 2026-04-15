import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/homePage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
