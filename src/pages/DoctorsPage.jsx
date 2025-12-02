import { useState, useMemo } from "react";

export default function DoctorsPage({ cases, users, onAddDoctor }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allCases = Array.isArray(cases) ? cases : [];
  const allUsers = Array.isArray(users) ? users : [];

  // doctors from user list (not from cases)
  const doctors = allUsers.filter((u) => u.role === "doctor");

  const doctorStats = useMemo(() => {
    return doctors.map((doc) => {
      const assigned = allCases.filter(
        (c) => c.assignedDoctor === doc.name
      );
      const total = assigned.length;
      const open = assigned.filter((c) => c.status === "open").length;
      const inReview = assigned.filter(
        (c) => c.status === "in_review"
      ).length;
      const closed = assigned.filter(
        (c) => c.status === "closed"
      ).length;

      return {
        doctor: doc,
        total,
        open,
        inReview,
        closed,
      };
    });
  }, [doctors, allCases]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !specialty.trim() || !password) {
      setError("All fields are required.");
      return;
    }

    if (!onAddDoctor) {
      setError("Doctor creation is not available.");
      return;
    }

    const ok = onAddDoctor({
      name,
      email,
      specialty,
      password,
    });

    if (!ok) {
      setError("Email already exists or data invalid.");
      return;
    }

    setSuccess("Doctor added successfully. They can now log in.");
    setName("");
    setEmail("");
    setSpecialty("");
    setPassword("");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Doctor workload & accounts
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          As an admin you can add doctors and monitor their assigned cases.
        </p>
      </header>

      {/* Add doctor form */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Add new doctor
        </h2>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-2 py-1">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded px-2 py-1">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              className="w-full border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. Maria Popescu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
              Specialty
            </label>
            <input
              className="w-full border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cardiology, Neurology..."
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
              Password (demo)
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
            >
              Add doctor
            </button>
          </div>
        </form>
      </section>

      {/* Doctor workload cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Doctor workload
        </h2>

        {doctorStats.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No doctors in the system yet. Add one using the form above.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {doctorStats.map(({ doctor, total, open, inReview, closed }) => (
              <div
                key={doctor.id}
                className="bg-white dark:bg-slate-900 rounded-lg shadow p-3 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {doctor.name}
                    </p>
                    {doctor.specialty && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {doctor.specialty}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {doctor.email}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Total
                    </p>
                    <p className="font-semibold">{total}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Open
                    </p>
                    <p className="font-semibold text-amber-700 dark:text-amber-300">
                      {open}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      In review
                    </p>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">
                      {inReview}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Closed
                    </p>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {closed}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
