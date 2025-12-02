
import { useNavigate, Link } from "react-router-dom";

export default function DoctorDashboard({
  user,
  cases = [],
  appointments = [],
  onUpdateCaseStatus,
  onUpdateAppointmentStatus,
  onLogout,
}) {
  const navigate = useNavigate();

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

  function handleCaseStatusChange(caseId, event) {
    const newStatus = event.target.value;
    if (typeof onUpdateCaseStatus === "function") {
      onUpdateCaseStatus(caseId, newStatus);
    }
  }

  function handleAppointmentStatusChange(appointmentId, event) {
    const newStatus = event.target.value;
    if (typeof onUpdateAppointmentStatus === "function") {
      onUpdateAppointmentStatus(appointmentId, newStatus);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Doctor Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Welcome, {user?.name || "Doctor"}.
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
        <KpiCard label="Assigned Cases" value={totalCases} />
        <KpiCard label="Open" value={openCases} />
        <KpiCard label="In Review" value={inReviewCases} />
        <KpiCard label="Closed" value={closedCases} />
      </section>

      {/* Cases list with status control */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Cases you are handling
        </h2>

        {cases.length === 0 ? (
          <p className="text-sm text-slate-500">
            No cases are assigned to you yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {cases.map((c) => (
              <li
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {c.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Patient ID: {c.patientId} • Created:{" "}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
  <span className="text-xs text-slate-500">Status:</span>
  <select
    className="border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={c.status}
    onChange={(e) => handleCaseStatusChange(c.id, e)}
  >
    <option value="open">Open</option>
    <option value="in_review">In review</option>
    <option value="closed">Closed</option>
  </select>

  <Link
    to={`/doctor/cases/${c.id}`}
    className="text-xs text-blue-600 hover:underline"
  >
    View
  </Link>
</div>

              </li>
            ))}
          </ul>
        )}
      </section>

      {/* KPI row for Appointments */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard label="Appointments" value={totalAppointments} />
        <KpiCard label="Scheduled" value={scheduledAppointments} />
        <KpiCard label="Completed" value={completedAppointments} />
        <KpiCard label="Cancelled" value={cancelledAppointments} />
      </section>

      {/* Appointment list with status control */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Your appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-sm text-slate-500">
            You don&apos;t have any appointments scheduled yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((a) => (
              <li
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {a.reason}
                  </p>
                  <p className="text-xs text-slate-500">
                    Patient ID: {a.patientId} • When:{" "}
                    {new Date(a.dateTime).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Status:</span>
                  <select
                    className="border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={a.status}
                    onChange={(e) =>
                      handleAppointmentStatusChange(a.id, e)
                    }
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
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
