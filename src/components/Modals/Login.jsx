import { useState } from "react";
import { API_BASE } from "../../config";
import toast from "react-hot-toast";

export default function Login({ onLogin, onSwitchToSignup , setShowLoginModal}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); // ✅ prevent page reload
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Save auth info FIRST
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      if (data.name) {
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", email);
      }

      // ✅ THEN notify App.jsx
      onLogin(data.name || "");
      toast.success("Login successful");
    } catch (err) {
      console.error(err);
      alert("Backend not reachable. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center" onClick={()=> setShowLoginModal(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          onClick={onSwitchToSignup}
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
        >
          Don’t have an account? Sign up
        </p>
      </div>
    </div>
  );
}
