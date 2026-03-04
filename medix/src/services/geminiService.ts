import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ExtractedQuestion {
  text: string;
  options: string[];
  correct_answer: string;
  subject: string;
  chapter: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "MCQ" | "Multi-Correct" | "Integer";
  explanation: string;
  tags?: string[];
}

export async function extractQuestionsFromPdf(base64Pdf: string): Promise<ExtractedQuestion[]> {
  const model = "gemini-3-flash-preview"; 
  
  const prompt = `
    Extract all educational questions from this PDF. 
    For each question, identify:
    - The question text
    - Options (A, B, C, D) if it's an MCQ
    - The correct answer
    - Subject (Physics, Chemistry, Biology, or Maths)
    - Chapter name
    - Difficulty level (Easy, Medium, Hard)
    - Question type (MCQ, Multi-Correct, or Integer)
    - A brief explanation or solution if available.
    - Tags (an array of specific sub-topics, e.g., ["Kinematics", "Equations of Motion"]).

    Return the data as a JSON array of objects.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correct_answer: { type: Type.STRING },
            subject: { type: Type.STRING },
            chapter: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            type: { type: Type.STRING },
            explanation: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["text", "options", "correct_answer", "subject", "chapter", "difficulty", "type"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
