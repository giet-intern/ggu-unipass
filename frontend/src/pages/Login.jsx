import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { facultyLogin } from "../api/facultyApi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await facultyLogin(username, password);

      // Pass the entire response data object (containing token and user)
      login(data);

      toast.success(data.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      // Show the specific error from the backend for better feedback
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-rose-700 text-center mb-6">
          Faculty Login
        </h2>
        <div className="space-y-4">
          <div className="flex items-center border border-rose-200 rounded-xl px-3">
            <FaUser className="text-rose-500" />
            <input
              className="w-full px-3 py-3 outline-none rounded-xl"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-rose-200 rounded-xl px-3">
            <FaLock className="text-rose-500" />
            <input
              className="w-full px-3 py-3 outline-none rounded-xl"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-rose-600 text-white font-medium py-3 rounded-xl hover:bg-rose-700 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
