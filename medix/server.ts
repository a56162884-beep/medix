import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("eduvault.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT CHECK(role IN ('teacher', 'student'))
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    options TEXT, -- JSON array
    correct_answer TEXT,
    subject TEXT,
    chapter TEXT,
    difficulty TEXT,
    type TEXT,
    explanation TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    duration INTEGER, -- in minutes
    total_marks INTEGER,
    questions TEXT, -- JSON array of question IDs
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS test_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER,
    student_id INTEGER,
    status TEXT DEFAULT 'pending', -- pending, completed
    FOREIGN KEY(test_id) REFERENCES tests(id),
    FOREIGN KEY(student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER,
    student_id INTEGER,
    score INTEGER,
    total_questions INTEGER,
    correct_count INTEGER,
    answers TEXT, -- JSON object {questionId: selectedOption}
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(test_id) REFERENCES tests(id),
    FOREIGN KEY(student_id) REFERENCES users(id)
  );
`);

// Seed initial users if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (email, name, role) VALUES (?, ?, ?)").run("teacher@eduvault.com", "Dr. Sharma", "teacher");
  db.prepare("INSERT INTO users (email, name, role) VALUES (?, ?, ?)").run("student@eduvault.com", "Rahul Kumar", "student");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/users/me", (req, res) => {
    const email = req.headers['x-user-email'] || "teacher@eduvault.com";
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    res.json(user);
  });

  app.get("/api/questions", (req, res) => {
    const questions = db.prepare("SELECT * FROM questions ORDER BY created_at DESC").all();
    res.json(questions.map((q: any) => ({ ...q, options: JSON.parse(q.options) })));
  });

  app.post("/api/questions", (req, res) => {
    const { text, options, correct_answer, subject, chapter, difficulty, type, explanation } = req.body;
    const result = db.prepare(`
      INSERT INTO questions (text, options, correct_answer, subject, chapter, difficulty, type, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(text, JSON.stringify(options), correct_answer, subject, chapter, difficulty, type, explanation);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/tests", (req, res) => {
    const tests = db.prepare("SELECT * FROM tests ORDER BY created_at DESC").all();
    res.json(tests.map((t: any) => ({ ...t, questions: JSON.parse(t.questions) })));
  });

  app.post("/api/tests", (req, res) => {
    const { title, duration, total_marks, questions, created_by, assigned_to } = req.body;
    const result = db.prepare(`
      INSERT INTO tests (title, duration, total_marks, questions, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, duration, total_marks, JSON.stringify(questions), created_by);
    
    const testId = result.lastInsertRowid;
    
    // Assign to students (for demo, assign to all students if not specified)
    const students = assigned_to || db.prepare("SELECT id FROM users WHERE role = 'student'").all().map((s: any) => s.id);
    const insertAssignment = db.prepare("INSERT INTO test_assignments (test_id, student_id) VALUES (?, ?)");
    for (const studentId of students) {
      insertAssignment.run(testId, studentId);
    }
    
    res.json({ id: testId });
  });

  app.get("/api/student/assignments/:studentId", (req, res) => {
    const assignments = db.prepare(`
      SELECT ta.*, t.title, t.duration, t.total_marks, t.questions
      FROM test_assignments ta
      JOIN tests t ON ta.test_id = t.id
      WHERE ta.student_id = ? AND ta.status = 'pending'
    `).all(req.params.studentId);
    res.json(assignments.map((a: any) => ({ ...a, questions: JSON.parse(a.questions) })));
  });

  app.post("/api/results", (req, res) => {
    const { test_id, student_id, score, total_questions, correct_count, answers } = req.body;
    db.prepare(`
      INSERT INTO results (test_id, student_id, score, total_questions, correct_count, answers)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(test_id, student_id, score, total_questions, correct_count, JSON.stringify(answers));
    
    db.prepare("UPDATE test_assignments SET status = 'completed' WHERE test_id = ? AND student_id = ?").run(test_id, student_id);
    
    res.json({ success: true });
  });

  app.get("/api/results/student/:studentId", (req, res) => {
    const results = db.prepare(`
      SELECT r.*, t.title
      FROM results r
      JOIN tests t ON r.test_id = t.id
      WHERE r.student_id = ?
      ORDER BY r.submitted_at DESC
    `).all(req.params.studentId);
    res.json(results.map((r: any) => ({ ...r, answers: JSON.parse(r.answers) })));
  });

  app.get("/api/analytics/teacher", (req, res) => {
    const classPerformance = db.prepare(`
      SELECT t.title, AVG(r.score) as avg_score, COUNT(r.id) as submissions
      FROM tests t
      LEFT JOIN results r ON t.id = r.test_id
      GROUP BY t.id
    `).all();
    
    const subjectAccuracy = db.prepare(`
      SELECT q.subject, AVG(CAST(r.correct_count AS FLOAT) / r.total_questions) * 100 as accuracy
      FROM results r
      JOIN tests t ON r.test_id = t.id
      JOIN questions q ON q.id IN (SELECT value FROM json_each(t.questions))
      GROUP BY q.subject
    `).all();

    res.json({ classPerformance, subjectAccuracy });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
