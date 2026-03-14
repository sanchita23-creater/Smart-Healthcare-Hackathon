-- ─────────────────────────────────────────────────────
-- Smart Healthcare Database Schema
-- Run: mysql -u root -p < schema.sql
-- ─────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS smart_healthcare;
USE smart_healthcare;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id         VARCHAR(30)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(100) NOT NULL,
  role       ENUM('admin','doctor','patient') NOT NULL DEFAULT 'patient',
  doctor_id  VARCHAR(20)  DEFAULT NULL,
  linked_id  VARCHAR(30)  DEFAULT NULL
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id                VARCHAR(30)  PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  age               INT          NOT NULL,
  gender            ENUM('Male','Female','Other') DEFAULT 'Male',
  blood             VARCHAR(5)   DEFAULT 'O+',
  location          VARCHAR(150) NOT NULL,
  contact           VARCHAR(20)  DEFAULT '',
  disease           VARCHAR(100) NOT NULL,
  prescription      TEXT         DEFAULT '',
  doctor            VARCHAR(100) DEFAULT '',
  doctor_id         VARCHAR(20)  DEFAULT '',
  status            ENUM('Under Treatment','Recovered','Critical') DEFAULT 'Under Treatment',
  date              DATE         NOT NULL,
  allergies         VARCHAR(200) DEFAULT 'None',
  chronic           VARCHAR(200) DEFAULT 'None',
  emergency_contact VARCHAR(200) DEFAULT '',
  current_meds      VARCHAR(200) DEFAULT 'None'
);

-- Patient History
CREATE TABLE IF NOT EXISTS patient_history (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  patient_id   VARCHAR(30)  NOT NULL,
  date         DATE         NOT NULL,
  disease      VARCHAR(100) NOT NULL,
  prescription TEXT         DEFAULT '',
  doctor       VARCHAR(100) DEFAULT '',
  notes        TEXT         DEFAULT '',
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id           VARCHAR(30)  PRIMARY KEY,
  patient_id   VARCHAR(30)  NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  doctor_id    VARCHAR(20)  NOT NULL,
  doctor       VARCHAR(100) NOT NULL,
  date         DATE         NOT NULL,
  time         VARCHAR(15)  DEFAULT '10:00 AM',
  status       ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  reason       VARCHAR(255) DEFAULT ''
);

-- Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id          VARCHAR(30)  PRIMARY KEY,
  patient_id  VARCHAR(30)  NOT NULL,
  medicine    VARCHAR(100) NOT NULL,
  dosage      VARCHAR(50)  DEFAULT '',
  time        VARCHAR(15)  NOT NULL,
  duration    VARCHAR(50)  DEFAULT '',
  active      TINYINT(1)   DEFAULT 1
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id         VARCHAR(30)  PRIMARY KEY,
  disease    VARCHAR(100) NOT NULL,
  location   VARCHAR(150) NOT NULL,
  cases      INT          DEFAULT 0,
  threshold  INT          DEFAULT 20,
  timestamp  VARCHAR(50)  NOT NULL,
  severity   ENUM('low','medium','high') DEFAULT 'medium'
);

-- ── SEED DATA ────────────────────────────────────────────────────────────

INSERT IGNORE INTO users VALUES
  ('U1', 'Dr. Admin Singh',  'admin@med.com',   'admin123',   'admin',   NULL,   NULL),
  ('U2', 'Dr. Suresh Patel', 'doctor@med.com',  'doctor123',  'doctor',  'D001', NULL),
  ('U3', 'Aryan Sharma',     'patient@med.com', 'patient123', 'patient', NULL,   'PHC-001');

INSERT IGNORE INTO patients VALUES
  ('PHC-001','Aryan Sharma',34,'Male','B+','Andheri, Mumbai','98765 43210','Dengue',
   'Paracetamol 500mg · ORS · Rest','Dr. Suresh Patel','D001','Recovered','2026-02-10',
   'Penicillin','Hypertension','Neha Sharma – 98765 43211','Amlodipine 5mg'),
  ('PHC-002','Priya Verma',28,'Female','A+','Bandra, Mumbai','91234 56780','Malaria',
   'Chloroquine · Primaquine','Dr. Anjali Rao','D002','Under Treatment','2026-03-01',
   'Sulfa drugs','None','Raj Verma – 91234 56781','None'),
  ('PHC-003','Rohit Gupta',45,'Male','O-','Pune','99887 76655','Typhoid',
   'Azithromycin 500mg · ORS','Dr. Suresh Patel','D001','Under Treatment','2026-03-05',
   'None','Diabetes Type 2','Sunita Gupta – 99887 76656','Metformin 500mg'),
  ('PHC-004','Sneha Pillai',22,'Female','AB+','Thane, Mumbai','90011 22334','Chikungunya',
   'NSAIDs · Physiotherapy','Dr. Suresh Patel','D001','Critical','2026-03-08',
   'Aspirin','None','Mohan Pillai – 90011 22335','Ibuprofen 400mg');

INSERT IGNORE INTO patient_history (patient_id, date, disease, prescription, doctor, notes) VALUES
  ('PHC-001','2025-08-20','Viral Fever','Paracetamol 650mg','Dr. Suresh Patel','Resolved in 4 days'),
  ('PHC-001','2026-02-10','Dengue','Paracetamol 500mg · ORS','Dr. Suresh Patel','Platelet count 80k – monitored'),
  ('PHC-002','2026-03-01','Malaria','Chloroquine · Primaquine','Dr. Anjali Rao','Fever 104°F'),
  ('PHC-003','2026-03-05','Typhoid','Azithromycin 500mg','Dr. Suresh Patel',''),
  ('PHC-004','2026-03-08','Chikungunya','NSAIDs · Physiotherapy','Dr. Suresh Patel','Severe joint pain');

INSERT IGNORE INTO appointments VALUES
  ('APT-001','PHC-001','Aryan Sharma','D001','Dr. Suresh Patel','2026-03-18','10:00 AM','confirmed','Dengue follow-up'),
  ('APT-002','PHC-003','Rohit Gupta','D001','Dr. Suresh Patel','2026-03-14','11:30 AM','pending','Typhoid check'),
  ('APT-003','PHC-002','Priya Verma','D002','Dr. Anjali Rao','2026-03-15','02:00 PM','pending','Malaria follow-up');

INSERT IGNORE INTO reminders VALUES
  ('REM-001','PHC-001','Amlodipine 5mg','1 tablet','08:00 AM','30 days',1),
  ('REM-002','PHC-001','Paracetamol 500mg','2 tablets','06:00 PM','5 days',1);

INSERT IGNORE INTO alerts VALUES
  ('ALT-001','Dengue','Andheri, Mumbai',58,50,'2026-03-12 08:30','high'),
  ('ALT-002','Chikungunya','Thane, Mumbai',36,30,'2026-03-11 19:10','medium');
