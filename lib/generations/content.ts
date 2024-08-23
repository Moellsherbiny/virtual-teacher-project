import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function generateLessonFromLLM(lesson: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `${lesson}
      بناءً على عنوان الدرس أعلاه، قم بإنشاء شرح شامل ومهني للدرس.
      
      استخدم تنسيق
      1. مقدمة موجزة
      2. شرح مفصل للمفاهيم الرئيسية
      3. أمثلة على الكود عند الاقتضاء
      4. ملخص أو خاتمة
      5. تمارين اختيارية أو قراءات إضافية

      تأكد من أن المحتوى جذاب وواضح ومناسب لبيئة التعلم.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response || !response.text) {
      throw new Error("Invalid response from Gemini API");
    }

    const text = await response.text();

    // Log the raw response text for debugging
    console.log("Raw AI response:", text);

    // Attempt to parse the text as JSON
    try {
      const parsedContent = JSON.parse(text);
      return parsedContent;
    } catch (error) {
      console.warn("Response is not valid JSON. Returning raw text.");
      return { content: text }; // Fallback to plain text
    }
  } catch (error) {
    console.error("Error generating lesson from LLM:", error);
    throw new Error("Failed to generate lesson content");
  }
}
