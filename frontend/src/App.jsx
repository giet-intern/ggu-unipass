import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import StudentLookup from "./pages/StudentLookup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageMids from "./pages/dashboard/ManageMids";
import UploadDues from "./pages/dashboard/UploadDues";
import UniversalHallticket from "./pages/dashboard/UniversalHallticket";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuth } = useAuth();

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />
      <div className="pt-16">
        <Routes>
          {!isAuth ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/download" element={<StudentLookup />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/manage-mids" element={<ManageMids />} />
                <Route path="/dashboard/upload-dues" element={<UploadDues />} />
                <Route
                  path="/dashboard/universal-hallticket"
                  element={<UniversalHallticket />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
}
