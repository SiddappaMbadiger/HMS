const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ==================================================
   PATIENT REGISTER (PUBLIC – MUST REGISTER FIRST)
================================================== */
app.post("/api/patients/register", (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql =
    "INSERT INTO patients (full_name, email, password) VALUES (?,?,?)";

  db.query(sql, [full_name, email, password], (err) => {
    if (err) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.json({ message: "Patient registered successfully" });
  });
});

/* ==================================================
   PATIENT LOGIN (ONLY IF REGISTERED)
================================================== */
app.post("/api/patients/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT id, full_name FROM patients WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      id: result[0].id,
      full_name: result[0].full_name,
      role: "patient"
    });
  });
});

/* ==================================================
   STAFF LOGIN (ADMIN / DOCTOR / NURSE / ETC.)
================================================== */
app.post("/api/users/login", (req, res) => {
  const { email, password, role } = req.body;

  const sql =
    "SELECT id, full_name, role FROM users WHERE email=? AND password=? AND role=?";

  db.query(sql, [email, password, role], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(result[0]);
  });
});

/* ================================
   ADMIN VIEW (ALL USERS)
================================ */
app.get("/api/admin/users", (req, res) => {
  db.query("SELECT id, full_name, email, role FROM users", (err, rows) => {
    res.json(rows);
  });
});

app.get("/api/admin/patients", (req, res) => {
  db.query("SELECT id, full_name, email, role FROM users", (err, rows) => {
    res.json(rows);
  });
});


/* ===============================
   NURSE: SAVE PATIENT VITALS
================================ */
app.post("/api/nurse/vitals", (req, res) => {
  const {
    patient_id,
    blood_pressure,
    heart_rate,
    temperature,
    status,
    nurse_id
  } = req.body;

  const sql = `
    INSERT INTO patient_vitals
    (patient_id, blood_pressure, heart_rate, temperature, status, nurse_id)
    VALUES (?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [patient_id, blood_pressure, heart_rate, temperature, status, nurse_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to save vitals" });
      }
      res.json({ message: "Vitals saved successfully" });
    }
  );
});





// /* Doctor sees vitals */
// app.get("/api/doctor/vitals",(req,res)=>{
//  db.query("SELECT * FROM patient_vitals", (e,r)=>res.json(r));
// });

// /* Doctor adds treatment */
// app.post("/api/doctor/treatment",(req,res)=>{
//  const {patient_id,vitals_id,diagnosis,treatment}=req.body;
//  db.query(
//   "INSERT INTO doctor_treatments(patient_id,vitals_id,diagnosis,treatment) VALUES(?,?,?,?)",
//   [patient_id,vitals_id,diagnosis,treatment],
//   ()=>res.json({message:"Treatment saved"})
//  );
// });

// /* Billing */
// app.post("/api/billing",(req,res)=>{
//  const {patient_id,treatment_id,amount,payment_mode}=req.body;
//  db.query(
//   "INSERT INTO billing(patient_id,treatment_id,amount,payment_mode) VALUES(?,?,?,?)",
//   [patient_id,treatment_id,amount,payment_mode],
//   ()=>res.json({message:"Bill generated"})
//  );
// });

/* ==================================================
   ROOT TEST
================================================== */
app.get("/", (req, res) => {
  res.send("HDMS Backend is running successfully");
});

/* ==================================================
   START SERVER
================================================== */
app.listen(3000, () => {
  console.log("HDMS Backend running on http://localhost:3000");
});
