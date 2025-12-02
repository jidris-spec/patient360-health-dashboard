import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [insuranceId, setInsuranceId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !insuranceId.trim() || !password) {
      setError("All fields are required.");
      return;
    }

    // Call parent signup handler
    const newUser = onSignup({
      name: name.trim(),
      email: email.trim(),
      insuranceId: insuranceId.trim(),
      password,
    });

    if (!newUser) {
      setError("Could not create user. Please try again.");
      return;
    }

    // After signup, go straight to patient dashboard
    navigate("/patient");
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Sign up as patient
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Create a patient account so you can submit cases and track your
        progress.
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
            Full name
          </label>
          <input
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Maria Popescu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-200 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-200 mb-1">
            Insurance ID / Patient ID
          </label>
          <input
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. RO-INS-123456"
            value={insuranceId}
            onChange={(e) => setInsuranceId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-200 mb-1">
            Password (demo only)
          </label>
          <input
            type="password"
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            For this MVP, the password is stored only in the browser (no real
            backend).
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
        >
          Create account
        </button>
      </form>
    </div>
  );
}
