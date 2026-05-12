import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/profilePage";
import PatientProfilePage from "./pages/patientProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import AdminLayout from "./pages/admin pages/AdminLayout";
import AdminLoginPage from "./pages/admin pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin pages/AdminDashboardPage";
import AdminDoctorsPage from "./pages/admin pages/AdminDoctorsPage";
import AdminPatientsPage from "./pages/admin pages/AdminPatientsPage";
import AdminAppointmentsPage from "./pages/admin pages/AdminAppointmentsPage";
import AdminSchedulesPage from "./pages/admin pages/AdminSchedulesPage";
import AdminVacationsPage from "./pages/admin pages/AdminVacationsPage";

function App() {
  const { isAuthenticated } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  const currentRole = user?.role ?? user?.attributes?.role ?? user?.roles?.[0] ?? user?.attributes?.type;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={currentRole === "admin" ? "/admin/dashboard" : "/doctors/dashboard"} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="doctors" element={<AdminDoctorsPage />} />
        <Route path="patients" element={<AdminPatientsPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="schedules" element={<AdminSchedulesPage />} />
        <Route path="vacations" element={<AdminVacationsPage />} />
      </Route>
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
      <Route
        path="/patients/:patientId"
        element={
          <ProtectedRoute>
            <PatientProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/home" element={<Navigate to="/doctors/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
