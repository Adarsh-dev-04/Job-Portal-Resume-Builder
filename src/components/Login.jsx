import { useState } from "react";
import { API_BASE } from "../config";

export default function Login({ onLogin, setUserName, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
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
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      onLogin();
      setUserName(data.name);
    } catch {
      alert("Backend not reachable. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col gap-20 items-center justify-center bg-orange-100">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login
        </h2>

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
        <p className="text-center mt-4 text-sm">
        New user? <button className="text-orange-600 underline" onClick={onSwitchToSignup}>Sign Up</button>
      </p>
      </form>
    </div>
  );
}
