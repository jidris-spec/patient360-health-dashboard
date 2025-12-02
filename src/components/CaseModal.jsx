import React from "react";

export default function CaseModal({
  isOpen,
  onClose,
  caseData,
  onAddAttachment,
}) {
  if (!isOpen || !caseData) return null;

  const attachments = Array.isArray(caseData.attachments)
    ? caseData.attachments
    : [];

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !caseData) return;

    const meta = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (onAddAttachment) {
      onAddAttachment(caseData.id, meta);
    }

    // clear file input so same file can be selected again if needed
    e.target.value = "";
  }

  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  function formatStatusBadge(status) {
    const label = status.replace("_", " ");
    if (status === "open") {
      return (
        <span className="inline-block text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
          {label}
        </span>
      );
    }
    if (status === "in_review") {
      return (
        <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {label}
        </span>
      );
    }
    return (
      <span className="inline-block text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
        {label}
      </span>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Case details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review symptoms, notes, and attachments.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        {/* Basic info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {caseData.patientName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Case ID: {caseData.id}
              </p>
            </div>
            {formatStatusBadge(caseData.status)}
          </div>

          {caseData.assignedDoctor && (
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Assigned doctor:{" "}
              <span className="font-medium">
                {caseData.assignedDoctor}
              </span>
            </p>
          )}

          {caseData.doctorNotes && (
            <div className="mt-1">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Doctor notes
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {caseData.doctorNotes}
              </p>
            </div>
          )}
        </div>

        {/* Symptoms */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Symptoms
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
            {caseData.symptoms}
          </p>
        </div>

        {/* Attachments section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Attachments
            </p>
          </div>

          {/* Upload control */}
          {onAddAttachment && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-600 dark:text-slate-300">
                Upload document:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="text-[11px] text-slate-700 dark:text-slate-200"
              />
            </div>
          )}

          {/* List of attachments */}
          {attachments.length === 0 ? (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              No attachments yet.
            </p>
          ) : (
            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {attachments.map((att) => (
                <li
                  key={att.id || att.name}
                  className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-100">
                      📄 {att.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {att.type || "Unknown type"}
                      {att.size ? ` • ${formatFileSize(att.size)}` : ""}
                    </p>
                    {(att.uploadedBy || att.uploadedByRole) && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Uploaded by{" "}
                        <span className="font-medium">
                          {att.uploadedBy || "Unknown"}
                        </span>
                        {att.uploadedByRole && (
                          <>
                            {" "}
                            ({att.uploadedByRole})
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
