import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard({
  user,
  cases = [],
  appointments = [],
  onCreateCase,
  onCreateAppointment,
  onLogout,
}) {
  const navigate = useNavigate();

  // Case form state
  const [caseTitle, setCaseTitle] = useState("");
  const [caseError, setCaseError] = useState("");

  // Appointment form state
  const [apptDateTime, setApptDateTime] = useState("");
  const [apptReason, setApptReason] = useState("");
  const [apptError, setApptError] = useState("");

  // Case KPIs
  const totalCases = cases.length;
  const openCases = cases.filter((c) => c.status === "open").length;
  const inReviewCases = cases.filter((c) => c.status === "in_review").length;
  const closedCases = cases.filter((c) => c.status === "closed").length;

  // Appointment KPIs
  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(
    (a) => a.status === "scheduled"
  ).length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  function handleLogoutClick() {
    if (typeof onLogout === "function") {
      onLogout();
    }
    navigate("/login");
  }

  function handleCaseSubmit(e) {
    e.preventDefault();
    setCaseError("");

    const trimmedTitle = caseTitle.trim();
    if (!trimmedTitle) {
      setCaseError("Please describe your problem or symptoms.");
      return;
    }

    if (typeof onCreateCase === "function") {
      onCreateCase({ title: trimmedTitle });
    }

    setCaseTitle("");
  }

  function handleAppointmentSubmit(e) {
    e.preventDefault();
    setApptError("");

    if (!apptDateTime) {
      setApptError("Please choose a date and time.");
      return;
    }

    const trimmedReason = apptReason.trim();
    if (!trimmedReason) {
      setApptError("Please add a reason for the appointment.");
      return;
    }

    if (typeof onCreateAppointment === "function") {
      onCreateAppointment({
        dateTime: apptDateTime,
        reason: trimmedReason,
      });
    }

    setApptDateTime("");
    setApptReason("");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Patient Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Welcome, {user?.name || "Patient"}.
          </p>
        </div>

        <button
          onClick={handleLogoutClick}
          className="text-xs px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700"
        >
          Logout
        </button>
      </header>

      {/* KPI row for Cases */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard label="Total Cases" value={totalCases} />
        <KpiCard label="Open" value={openCases} />
        <KpiCard label="In Review" value={inReviewCases} />
        <KpiCard label="Closed" value={closedCases} />
      </section>

      {/* Your Cases */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Your Cases
        </h2>

        {cases.length === 0 ? (
          <p className="text-sm text-slate-500">
            You don&apos;t have any cases yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {cases.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {c.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Status: {c.status} • Created:{" "}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* New Case form */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Create a new case
        </h2>
        <p className="text-xs text-slate-500">
          Briefly describe what you&apos;re experiencing. Your doctor will see this
          in their dashboard.
        </p>

        {caseError && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-2 py-1">
            {caseError}
          </p>
        )}

        <form onSubmit={handleCaseSubmit} className="space-y-2">
          <textarea
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Example: Chest pain when walking, started 3 days ago..."
            value={caseTitle}
            onChange={(e) => setCaseTitle(e.target.value)}
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Case
          </button>
        </form>
      </section>

      {/* Appointment KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard label="Appointments" value={totalAppointments} />
        <KpiCard label="Scheduled" value={scheduledAppointments} />
        <KpiCard label="Completed" value={completedAppointments} />
        <KpiCard label="Cancelled" value={cancelledAppointments} />
      </section>

      {/* Appointment list */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Your appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-sm text-slate-500">
            You don&apos;t have any appointments yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {a.reason}
                  </p>
                  <p className="text-xs text-slate-500">
                    When:{" "}
                    {new Date(a.dateTime).toLocaleString()} • Status: {a.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Appointment form */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Book an appointment
        </h2>
        <p className="text-xs text-slate-500">
          Choose a time and briefly describe the reason for your visit.
        </p>

        {apptError && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-2 py-1">
            {apptError}
          </p>
        )}

        <form onSubmit={handleAppointmentSubmit} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="datetime-local"
              className="flex-1 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={apptDateTime}
              onChange={(e) => setApptDateTime(e.target.value)}
            />
          </div>

          <textarea
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Reason for appointment"
            value={apptReason}
            onChange={(e) => setApptReason(e.target.value)}
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Book Appointment
          </button>
        </form>
      </section>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  );
}
