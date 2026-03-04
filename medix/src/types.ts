export interface User {
  id: number;
  email: string;
  name: string;
  role: 'teacher' | 'student';
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct_answer: string;
  subject: string;
  chapter: string;
  topic?: string;
  tags?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Multi-Correct' | 'Integer';
  explanation?: string;
  image_url?: string;
  created_at: string;
}

export interface Test {
  id: number;
  title: string;
  duration: number;
  total_marks: number;
  questions: number[]; // Array of question IDs
  created_by: number;
  created_at: string;
}

export interface TestAssignment extends Test {
  assignment_id: number;
  status: 'pending' | 'completed';
}

export interface Result {
  id: number;
  test_id: number;
  student_id: number;
  score: number;
  total_questions: number;
  correct_count: number;
  answers: Record<number, string>;
  submitted_at: string;
  title?: string;
}
