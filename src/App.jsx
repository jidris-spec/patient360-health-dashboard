import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import DoctorsPage from "./pages/DoctorsPage.jsx";
import CaseDetailsPage from "./pages/CaseDetailsPage.jsx";

// --- DEFAULT USERS (boot data) ---
const DEFAULT_USERS = [
  {
    id: "u-patient-1",
    role: "patient",
    name: "John Doe",
    email: "john@example.com",
    insuranceId: "INS-RO-001",
    password: "patient123", // demo only
  },
  {
    id: "u-patient-2",
    role: "patient",
    name: "Sarah Ali",
    email: "sarah@example.com",
    insuranceId: "INS-RO-002",
    password: "patient123", // demo only
  },
  {
    id: "u-doctor-1",
    role: "doctor",
    name: "Dr. Ahmed Musa",
    email: "ahmed@clinic.com",
    specialty: "Cardiology",
    password: "doctor123", // demo only
  },
];

// --- DEFAULT CASES (boot data) ---
const DEFAULT_CASES = [
  {
    id: "case-1",
    patientId: "u-patient-1",
    doctorId: "u-doctor-1",
    title: "Chest pain and shortness of breath",
    status: "open", // "open" | "in_review" | "closed"
    createdAt: new Date().toISOString(),
    // doctorNotes: "Example note",
  },
  {
    id: "case-2",
    patientId: "u-patient-1",
    doctorId: "u-doctor-1",
    title: "Routine follow-up check",
    status: "in_review",
    createdAt: new Date().toISOString(),
  },
  {
    id: "case-3",
    patientId: "u-patient-2",
    doctorId: "u-doctor-1",
    title: "Headache and fatigue",
    status: "closed",
    createdAt: new Date().toISOString(),
  },
];

// --- DEFAULT APPOINTMENTS (boot data) ---
const DEFAULT_APPOINTMENTS = [
  {
    id: "appt-1",
    patientId: "u-patient-1",
    doctorId: "u-doctor-1",
    dateTime: new Date().toISOString(), // now
    reason: "Follow-up on chest pain",
    status: "scheduled", // "scheduled" | "completed" | "cancelled"
    createdAt: new Date().toISOString(),
  },
];

// --- Protected Route Component ---
function ProtectedRoute({ user, allowed, isAuthReady, children }) {
  // Wait until we've tried to restore auth from localStorage
  if (!isAuthReady) {
    return null; // or a small loader if you want
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Bootstrapping users + cases + appointments + authUser from localStorage (or defaults)
  useEffect(() => {
    // Users
    const savedUsers = localStorage.getItem("users");
    if (!savedUsers) {
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    } else {
      setUsers(JSON.parse(savedUsers));
    }

    // Cases
    const savedCases = localStorage.getItem("cases");
    if (!savedCases) {
      localStorage.setItem("cases", JSON.stringify(DEFAULT_CASES));
      setCases(DEFAULT_CASES);
    } else {
      setCases(JSON.parse(savedCases));
    }

    // Appointments
    const savedAppointments = localStorage.getItem("appointments");
    if (!savedAppointments) {
      localStorage.setItem(
        "appointments",
        JSON.stringify(DEFAULT_APPOINTMENTS)
      );
      setAppointments(DEFAULT_APPOINTMENTS);
    } else {
      setAppointments(JSON.parse(savedAppointments));
    }

    // Restore logged-in user if any
    const rawAuth = localStorage.getItem("authUser");
    if (rawAuth) {
      try {
        const storedUser = JSON.parse(rawAuth);
        setAuthUser(storedUser);
      } catch {
        localStorage.removeItem("authUser");
      }
    }

    // Now we know we've tried to restore auth
    setIsAuthReady(true);
  }, []);

  // Persist users when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  // Persist cases when they change
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem("cases", JSON.stringify(cases));
    }
  }, [cases]);

  // Persist appointments when they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    }
  }, [appointments]);

  // --- Auth: logout ---
  function handleLogout() {
    setAuthUser(null);
    localStorage.removeItem("authUser");
  }

  // --- Create Case for currently logged-in patient ---
  function handleCreateCaseForCurrentPatient(newCaseData) {
    if (!authUser || authUser.role !== "patient") return;

    setCases((prev) => {
      const newCase = {
        id: `case-${prev.length + 1}`,
        patientId: authUser.id,
        doctorId: "u-doctor-1", // demo doctor
        title: newCaseData.title,
        status: "open",
        createdAt: new Date().toISOString(),
      };

      return [...prev, newCase];
    });
  }

  // --- Update case status (doctor action) ---
  function handleUpdateCaseStatus(caseId, newStatus) {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, status: newStatus } : c
      )
    );
  }

  // --- Update case doctor notes (doctor action) ---
  function handleUpdateCaseNotes(caseId, notes) {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, doctorNotes: notes } : c
      )
    );
  }

  // --- Create Appointment for currently logged-in patient ---
  function handleCreateAppointmentForCurrentPatient(data) {
    if (!authUser || authUser.role !== "patient") return;

    setAppointments((prev) => {
      const newAppointment = {
        id: `appt-${prev.length + 1}`,
        patientId: authUser.id,
        doctorId: "u-doctor-1", // same demo doctor for now
        dateTime: data.dateTime, // ISO string
        reason: data.reason,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      };

      return [...prev, newAppointment];
    });
  }

  // --- Update appointment status (doctor action) ---
  function handleUpdateAppointmentStatus(appointmentId, newStatus) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: newStatus } : a
      )
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<Login setAuthUser={setAuthUser} />}
      />
      <Route
        path="/signup"
        element={<Signup users={users} setUsers={setUsers} />}
      />

      {/* Patient dashboard */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute
            user={authUser}
            allowed={["patient"]}
            isAuthReady={isAuthReady}
          >
            <PatientDashboard
              user={authUser}
              cases={cases.filter((c) => c.patientId === authUser?.id)}
              appointments={appointments.filter(
                (a) => a.patientId === authUser?.id
              )}
              onCreateCase={handleCreateCaseForCurrentPatient}
              onCreateAppointment={handleCreateAppointmentForCurrentPatient}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* Doctor dashboard */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute
            user={authUser}
            allowed={["doctor"]}
            isAuthReady={isAuthReady}
          >
            <DoctorDashboard
              user={authUser}
              cases={cases.filter((c) => c.doctorId === authUser?.id)}
              appointments={appointments.filter(
                (a) => a.doctorId === authUser?.id
              )}
              onUpdateCaseStatus={handleUpdateCaseStatus}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* Doctor case details */}
      <Route
        path="/doctor/cases/:caseId"
        element={
          <ProtectedRoute
            user={authUser}
            allowed={["doctor"]}
            isAuthReady={isAuthReady}
          >
            <CaseDetailsPage
              user={authUser}
              cases={cases}
              users={users}
              onUpdateCaseNotes={handleUpdateCaseNotes}
            />
          </ProtectedRoute>
        }
      />

      {/* Doctor-only admin views */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute
            user={authUser}
            allowed={["doctor"]}
            isAuthReady={isAuthReady}
          >
            <PatientsPage users={users} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute
            user={authUser}
            allowed={["doctor"]}
            isAuthReady={isAuthReady}
          >
            <DoctorsPage users={users} />
          </ProtectedRoute>
        }
      />

      {/* Fallback: anything else → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
