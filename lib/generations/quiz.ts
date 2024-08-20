import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateQuizFromLLM(courseTitle: string) {
  let model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  let prompt = `
Create a JSON quiz with 5 multiple-choice for this course ${courseTitle} questions in Arabic. Each question should have four options and a clear correct answer. Use English for object notation and Arabic for question and options. Follow this structure:
  {
    "questions": [
      {
        "text": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Correct option"
      }
    ]
  }`;

  let result = await model.generateContent(prompt);
  console.log(result.response.text());
  return JSON.parse(result.response.text());
}
