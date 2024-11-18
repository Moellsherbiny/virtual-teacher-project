import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
let model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
let generationConfig =  {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
}
export async function generateQuizFromLLM(courseTitle: string) {

  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });
  let prompt = `
 Create a JSON quiz with 5 multiple-choice for this course ${courseTitle} questions in Arabic. And make questions have variety such as (true or false questions, choices, etc) Each question should have four options and a clear correct answer. Use English for object notation and Arabic for question and options. Follow this structure:
  {
    "questions": [
      {
        "text": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Correct option"
      }
    ]
  }`;

  let result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());
  return JSON.parse(result.response.text());
}
