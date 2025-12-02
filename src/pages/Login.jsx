import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    // Load all users from localStorage
    const raw = localStorage.getItem("users");
    let users = [];

    try {
      users = raw ? JSON.parse(raw) : [];
    } catch {
      users = [];
    }

    // Find user that matches the credentials (demo only)
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }

    // Save user to React state
    setAuthUser(foundUser);

    // Persist login so refresh doesn’t log them out
    localStorage.setItem("authUser", JSON.stringify(foundUser));

    // Redirect based on role
    if (foundUser.role === "patient") {
      navigate("/patient/dashboard");
    } else if (foundUser.role === "doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Login
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Sign in to your patient or doctor account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-xl shadow p-5 space-y-3 border border-slate-200 dark:border-slate-800"
      >
        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-2 py-1">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-200 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-200 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Demo users:
          <br />
          <span className="text-xs">john@example.com → patient123</span>
          <br />
          <span className="text-xs">ahmed@clinic.com → doctor123</span>
        </p>
      </form>
    </div>
  );
}
