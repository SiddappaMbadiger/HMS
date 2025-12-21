const API = "http://localhost:3000/api";

/* ================= LOGIN ================= */
async function loginUser() {
  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    const url =
      role === "patient"
        ? API + "/patients/login"
        : API + "/users/login";

    const body =
      role === "patient"
        ? { email, password }
        : { email, password, role };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("hdmsUser", JSON.stringify(data));

    if (role === "patient") location.href = "patient.html";
    else if (role === "admin") location.href = "admin.html";
    else if (role === "doctor") location.href = "doctor.html";
    else if (role === "nurse") location.href = "nurse.html";
    else if (role === "billing") location.href = "billing.html";
    else if (role === "receptionist") location.href = "receptionist.html";

  } catch (err) {
    alert("Server not reachable. Is backend running?");
  }
}

/* ================= PATIENT REGISTER ================= */
async function registerPatient() {
  const full_name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!full_name || !email || !password) {
    alert("All fields required");
    return;
  }

  try {
    const res = await fetch(API + "/patients/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Registration successful. Please login.");
    switchToLogin();

  } catch {
    alert("Server not reachable");
  }
}

// save the vital by nurses.

async function saveVitals() {
  const user = JSON.parse(localStorage.getItem("hdmsUser"));

  if (!user || user.role !== "nurse") {
    alert("Nurse not logged in");
    return;
  }

  const patient_id = document.getElementById("patientId").value;
  const blood_pressure = document.getElementById("bp").value;
  const heart_rate = document.getElementById("hr").value;
  const temperature = document.getElementById("temp").value;
  const status = document.getElementById("status").value;

  const res = await fetch("http://localhost:3000/api/nurse/vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patient_id,
      blood_pressure,
      heart_rate,
      temperature,
      status,
      nurse_id: user.id   // ⭐ VERY IMPORTANT
    })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    document.getElementById("patientId").value = "";
    document.getElementById("bp").value = "";
    document.getElementById("hr").value = "";
    document.getElementById("temp").value = "";
    document.getElementById("status").value = "Normal";
  }
}



/* ================= POPUPS ================= */
function openPopup(id) {
  document.getElementById("overlay").style.display = "block";
  document.getElementById(id).style.display = "block";
}

function closeAllPopups() {
  document.getElementById("overlay").style.display = "none";
  document.querySelectorAll(".popup").forEach(p => p.style.display = "none");
}

function switchToRegister() {
  closeAllPopups();
  openPopup("registerPopup");
}

function switchToLogin() {
  closeAllPopups();
  openPopup("loginPopup");
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}



