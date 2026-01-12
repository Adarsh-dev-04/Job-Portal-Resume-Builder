import { useState } from "react";
import { API_BASE } from "../../config";
import toast from "react-hot-toast";

export default function Signup({ onSignup, onSwitchToLogin, setShowSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");
      onSignup(); // 
    } catch (err) {
      alert("Backend not reachable. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center" onClick={()=> setShowSignup(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-gray-200 rounded focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-gray-200 rounded focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-gray-200 rounded focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p
          onClick={onSwitchToLogin}
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
