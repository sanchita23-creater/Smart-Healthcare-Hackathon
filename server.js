import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

// ── MySQL connection pool ──────────────────────────────────────────────────
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sanchita@23",
  database: "smart_healthcare",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection on startup
pool.getConnection()
  .then(conn => { console.log("✅ MySQL connected"); conn.release(); })
  .catch(err => console.error("❌ MySQL connection failed:", err.message));

// ── AUTH ───────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    const { password: _, ...user } = rows[0];
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATIENTS ───────────────────────────────────────────────────────────────
app.get("/api/patients", async (req, res) => {
  try {
    const [patients] = await pool.query("SELECT * FROM patients ORDER BY date DESC");
    // Attach history for each patient
    for (const p of patients) {
      const [hist] = await pool.query(
        "SELECT * FROM patient_history WHERE patient_id = ? ORDER BY date DESC",
        [p.id]
      );
      p.history = hist;
    }
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/patients/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM patients WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Patient not found" });
    const patient = rows[0];
    const [hist] = await pool.query(
      "SELECT * FROM patient_history WHERE patient_id = ? ORDER BY date DESC",
      [patient.id]
    );
    patient.history = hist;
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/patients", async (req, res) => {
  const { id, name, age, gender, blood, location, contact, disease, prescription,
          doctor, doctorId, status, date, allergies, chronic, emergencyContact, currentMeds } = req.body;
  try {
    await pool.query(
      `INSERT INTO patients (id, name, age, gender, blood, location, contact, disease,
       prescription, doctor, doctor_id, status, date, allergies, chronic, emergency_contact, current_meds)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, name, age, gender, blood, location, contact, disease, prescription,
       doctor, doctorId, status, date, allergies, chronic, emergencyContact, currentMeds]
    );
    // Insert first history entry
    if (req.body.history && req.body.history.length > 0) {
      const h = req.body.history[0];
      await pool.query(
        "INSERT INTO patient_history (patient_id, date, disease, prescription, doctor, notes) VALUES (?,?,?,?,?,?)",
        [id, h.date, h.disease, h.prescription || "", h.doctor, h.notes || ""]
      );
    }
    res.status(201).json({ message: "Patient registered", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/patients/:id", async (req, res) => {
  const { disease, prescription, doctor, status, notes } = req.body;
  const today = new Date().toISOString().split("T")[0];
  try {
    await pool.query(
      "UPDATE patients SET disease=?, prescription=?, doctor=?, status=?, date=? WHERE id=?",
      [disease, prescription, doctor, status, today, req.params.id]
    );
    await pool.query(
      "INSERT INTO patient_history (patient_id, date, disease, prescription, doctor, notes) VALUES (?,?,?,?,?,?)",
      [req.params.id, today, disease, prescription, doctor, notes || ""]
    );
    res.json({ message: "Patient updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── APPOINTMENTS ───────────────────────────────────────────────────────────
app.get("/api/appointments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/appointments", async (req, res) => {
  const { id, patientId, patientName, doctorId, doctor, date, time, reason } = req.body;
  try {
    await pool.query(
      "INSERT INTO appointments (id, patient_id, patient_name, doctor_id, doctor, date, time, status, reason) VALUES (?,?,?,?,?,?,?,?,?)",
      [id, patientId, patientName, doctorId, doctor, date, time, "pending", reason]
    );
    res.status(201).json({ message: "Appointment booked", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/appointments/:id", async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE appointments SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ message: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── REMINDERS ──────────────────────────────────────────────────────────────
app.get("/api/reminders", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reminders");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reminders", async (req, res) => {
  const { id, patientId, medicine, dosage, time, duration } = req.body;
  try {
    await pool.query(
      "INSERT INTO reminders (id, patient_id, medicine, dosage, time, duration, active) VALUES (?,?,?,?,?,?,1)",
      [id, patientId, medicine, dosage, time, duration]
    );
    res.status(201).json({ message: "Reminder added", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/reminders/:id", async (req, res) => {
  const { active } = req.body;
  try {
    await pool.query("UPDATE reminders SET active=? WHERE id=?", [active ? 1 : 0, req.params.id]);
    res.json({ message: "Reminder updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/reminders/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM reminders WHERE id=?", [req.params.id]);
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ALERTS ─────────────────────────────────────────────────────────────────
app.get("/api/alerts", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM alerts ORDER BY timestamp DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/alerts", async (req, res) => {
  const { id, disease, location, cases, threshold, severity } = req.body;
  const timestamp = new Date().toLocaleString("en-IN");
  try {
    await pool.query(
      "INSERT INTO alerts (id, disease, location, cases, threshold, timestamp, severity) VALUES (?,?,?,?,?,?,?)",
      [id, disease, location, cases, threshold, timestamp, severity]
    );
    res.status(201).json({ message: "Alert raised", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/alerts/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM alerts WHERE id=?", [req.params.id]);
    res.json({ message: "Alert resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend server running on http://localhost:${PORT}`));
