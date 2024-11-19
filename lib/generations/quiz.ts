import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateQuizFromLLM(courseTitle: string) {
  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API key is not defined. Please set GEMINI_API_KEY in your environment variables.");
  }

  try {
    // Initialize the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Construct the prompt
    const prompt = `
    Create a JSON quiz with 5 questions in Arabic for the course "${courseTitle}". 
    Questions should include variety (e.g., true/false, multiple-choice). 
    Each question must have four options and a clear correct answer. Use this structure:
    {
      "questions": [
        {
          "text": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Correct option"
        }
      ]
    }`;

    // Call the generative model
    const result = await model.generateContent(prompt);

    // Ensure the response exists and process it
    if (!result || !result.response) {
      throw new Error("No response received from the model.");
    }

    const responseText = await result.response.text();

    // Validate and parse JSON
    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error(`Invalid JSON returned by the API: ${responseText}`);
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
