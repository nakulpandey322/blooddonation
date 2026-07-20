import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import GenericDashboard from "./pages/GenericDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/donor"
          element={<ProtectedRoute allow={["donor"]}><DonorDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/patient"
          element={<ProtectedRoute allow={["patient"]}><PatientDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/:role"
          element={<ProtectedRoute allow={["hospital", "bloodbank", "ngo", "admin"]}><GenericDashboard /></ProtectedRoute>}
        />
      </Routes>
    </AuthProvider>
  );
}
