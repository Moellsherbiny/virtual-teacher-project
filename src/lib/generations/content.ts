import { getAIClient } from "../aiClient";


export async function generateLessonFromLLM(lesson: string) {
  const ai = getAIClient();

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
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const response = await result.text;

    if (!response || response.length === 0) {
      throw new Error("Invalid response from Gemini API");
    }

  

    // Log the raw response text for debugging
    console.log("Raw AI response:", response);

    // Attempt to parse the text as JSON
    try {
      const parsedContent = JSON.parse(response);
      return parsedContent;
    } catch (error) {
      console.warn("Response is not valid JSON. Returning raw text.");
      return { content: response }; // Fallback to plain text
    }
  } catch (error) {
    console.error("Error generating lesson from LLM:", error);
    throw new Error("Failed to generate lesson content");
  }
}
