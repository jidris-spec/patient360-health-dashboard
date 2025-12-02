// src/pages/PatientsPage.jsx
export default function PatientsPage({ cases }) {
  // Build a map of patients from cases
  const patientMap = cases.reduce((acc, c) => {
    const name = c.patientName || "Unknown patient";

    if (!acc[name]) {
      acc[name] = {
        name,
        totalCases: 0,
        open: 0,
        inReview: 0,
        closed: 0,
      };
    }

    acc[name].totalCases += 1;
    if (c.status === "open") acc[name].open += 1;
    if (c.status === "in_review") acc[name].inReview += 1;
    if (c.status === "closed") acc[name].closed += 1;

    return acc;
  }, {});

  const patients = Object.values(patientMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Dashboard /{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          Patients
        </span>
      </p>

      <div
        className="
          rounded-2xl 
          shadow-sm 
          border 
          border-slate-200 
          dark:border-slate-800 
          bg-white 
          dark:bg-slate-900 
          p-6 
          space-y-4
        "
      >
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Patients overview
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Aggregated view of all patients based on their cases.
          </p>
        </header>

        {patients.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No patients yet. Create cases from the Patient dashboard.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 pr-4">Patient</th>
                  <th className="py-2 pr-4 text-right">Total</th>
                  <th className="py-2 pr-4 text-right">Open</th>
                  <th className="py-2 pr-4 text-right">In review</th>
                  <th className="py-2 pr-4 text-right">Closed</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.name}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                  >
                    <td className="py-2 pr-4 text-slate-900 dark:text-slate-50">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-900 dark:text-slate-50">
                      {p.totalCases}
                    </td>
                    <td className="py-2 pr-4 text-right text-amber-700 dark:text-amber-300">
                      {p.open}
                    </td>
                    <td className="py-2 pr-4 text-right text-blue-700 dark:text-blue-300">
                      {p.inReview}
                    </td>
                    <td className="py-2 pr-4 text-right text-emerald-700 dark:text-emerald-300">
                      {p.closed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
