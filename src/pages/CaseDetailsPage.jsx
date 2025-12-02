import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CaseDetailsPage({
  user,
  cases = [],
  users = [],
  onUpdateCaseNotes,
}) {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const caseItem = useMemo(
    () => cases.find((c) => c.id === caseId),
    [cases, caseId]
  );

  const patient = useMemo(
    () =>
      caseItem
        ? users.find((u) => u.id === caseItem.patientId)
        : null,
    [users, caseItem]
  );

  const doctor = useMemo(
    () =>
      caseItem
        ? users.find((u) => u.id === caseItem.doctorId)
        : null,
    [users, caseItem]
  );

  const [notes, setNotes] = useState(caseItem?.doctorNotes ?? "");
  const [saveError, setSaveError] = useState("");
  const [saveState, setSaveState] = useState("idle"); // "idle" | "saving" | "saved"

  // Keep local notes in sync if case changes (e.g., navigating between cases)
  useEffect(() => {
    setNotes(caseItem?.doctorNotes ?? "");
    setSaveState("idle");
    setSaveError("");
  }, [caseItem]);

  if (!caseItem) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xs mb-2 text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <p className="text-sm text-red-500">
          Case not found.
        </p>
      </div>
    );
  }

  function handleSaveNotes(e) {
    e.preventDefault();
    setSaveError("");

    if (!user || user.role !== "doctor") {
      setSaveError("Only doctors can edit notes.");
      return;
    }

    if (typeof onUpdateCaseNotes !== "function") {
      setSaveError("Notes update is not available.");
      return;
    }

    const trimmed = notes.trim();

    // You can decide if empty is allowed; I'm allowing empty but you could block it.
    setSaveState("saving");
    onUpdateCaseNotes(caseItem.id, trimmed);
    setSaveState("saved");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs mb-2 text-blue-600 hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Case Details
          </h1>
          <p className="text-xs text-slate-500">
            ID: {caseItem.id}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Doctor</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {doctor?.name || "Unknown doctor"}
          </p>
        </div>
      </header>

      {/* Summary */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Summary
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {caseItem.title}
        </p>
        <p className="text-xs text-slate-500">
          Status: {caseItem.status} • Created:{" "}
          {new Date(caseItem.createdAt).toLocaleString()}
        </p>
      </section>

      {/* Patient info */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Patient
        </h2>
        {patient ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {patient.name}
            </p>
            <p className="text-xs text-slate-500">
              Email: {patient.email}
            </p>
            {patient.insuranceId && (
              <p className="text-xs text-slate-500">
                Insurance ID: {patient.insuranceId}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Patient information not available.
          </p>
        )}
      </section>

      {/* Doctor Notes */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Doctor Notes
        </h2>
        <p className="text-xs text-slate-500">
          Use this section to record your clinical notes, diagnosis and plan for
          this case. Changes are stored with the case and visible to you when
          you return.
        </p>

        {saveError && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-2 py-1">
            {saveError}
          </p>
        )}

        <form onSubmit={handleSaveNotes} className="space-y-2">
          <textarea
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Example: Patient reports chest pain on exertion for 3 days. No history of hypertension. Plan: ECG, blood tests, follow-up in 1 week."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (saveState === "saved") setSaveState("idle");
            }}
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
              disabled={saveState === "saving"}
            >
              {saveState === "saving" ? "Saving..." : "Save Notes"}
            </button>

            {saveState === "saved" && (
              <span className="text-xs text-emerald-600">
                Notes saved.
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
