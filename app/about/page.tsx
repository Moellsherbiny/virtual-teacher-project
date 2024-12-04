"use client";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// استيراد الروبوت
const robotVariants = {
  hover: {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  },
};

const Robot = () => (
  <motion.div
    className="relative w-[150px] h-[150px] rounded-full bg-gradient-to-b from-blue-600 to-blue-300 dark:bg-black flex items-center justify-center shadow-lg"
    variants={robotVariants}
    animate="hover"
  >
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="relative w-[120px] h-[120px] rounded-full bg-blue-500 flex items-center justify-center">
        <motion.div
          className="absolute top-[40%] left-[30%] w-[15px] h-[15px] bg-white rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[40%] right-[30%] w-[15px] h-[15px] bg-white rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute top-[-15px] w-[10px] h-[20px] bg-blue-500"></div>
        <div className="absolute top-[-25px] w-[10px] h-[10px] bg-pink-500 rounded-full"></div>
      </div>
    </motion.div>
  </motion.div>
);

export default function About() {
  useEffect(() => {
    const playVoice = () => {
      if ("speechSynthesis" in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();

        utterance.text =
          "Welcome to the Virtual Educational Robot. We are an innovative educational platform that uses artificial intelligence to provide a personalized and interactive learning experience. Our goal is to make education accessible and effective for all students.";

        utterance.lang = "en-US";

        const checkVoices = setInterval(() => {
          const voices = synth.getVoices();
          if (voices.length > 0) {
            clearInterval(checkVoices);

            const englishVoice = voices.find((voice) => voice.lang === "en-US");
            if (englishVoice) {
              utterance.voice = englishVoice;
            }
            synth.speak(utterance);
          }
        }, 100);
      }
    };

    playVoice();
  }, []);

  return (
    <div dir="rtl" className="container mx-auto py-12 space-y-12">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight text-center lg:text-5xl text-primary mb-12">
        من أنا  
      </h1>

      {/* إضافة الروبوت */}
      <div className="flex justify-center mb-12">
        <Robot />
      </div>

      <main className="space-y-12">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-muted-foreground">
              من نحن
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed dark:text-gray-200">
              الروبوت الافتراضي هو منصة تعليمية مبتكرة تستخدم تقنيات الذكاء
              الاصطناعي لتوفير تجربة تعلم شخصية وتفاعلية. هدفنا هو جعل التعليم
              متاحًا وفعالًا لجميع الطلاب، بغض النظر عن مستواهم أو خلفيتهم.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-muted-foreground">
              الإمكانيات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="my-6 mr-6 list-disc text-lg leading-relaxed dark:text-gray-200 space-y-4">
              <li>
                <span className="font-bold">التحدث مع الروبوت التعليمي:</span> 
                يمكن للطلاب طرح الأسئلة والحصول على إجابات فورية بطريقة تفاعلية.
              </li>
              <li>
                <span className="font-bold">توفير محتوى تعليمي:</span> 
                يتضمن دروسًا وشروحات متكاملة تغطي مجموعة واسعة من المواد الدراسية.
              </li>
              <li>
                <span className="font-bold">إجراء الاختبارات وتصحيحها:</span> 
                يوفر النظام اختبارات تفاعلية مع إمكانية تصحيح الإجابات وعرض الأخطاء.
              </li>
              <li>
                <span className="font-bold">الاشتراك في المحتوى التعليمي:</span> 
                يمكن للطلاب الاشتراك للحصول على محتوى مميز وشامل.
              </li>
              <li>
                <span className="font-bold">عرض النتائج:</span> 
                يوفر تقارير تفصيلية عن التقدم الدراسي ومستوى الأداء.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg overflow-hidden">
  <CardHeader>
    <CardTitle className="text-2xl font-semibold text-muted-foreground">
      كيف يعمل الروبوت
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    <p className="text-lg leading-relaxed dark:text-gray-200">
      يعتمد الروبوت التعليمي الافتراضي على مجموعة من التقنيات المتقدمة لتوفير تجربة تعليمية فريدة. يعمل الروبوت وفق الخطوات التالية:
    </p>
    <ol className="my-6 mr-6 list-decimal text-lg leading-relaxed dark:text-gray-200 space-y-4">
      <li>
        <span className="font-bold">معالجة المدخلات:</span> 
        عندما يطرح المستخدم سؤالًا أو يطلب شرحًا، يقوم الروبوت بتحليل النص باستخدام تقنيات معالجة اللغة الطبيعية (NLP).
      </li>
      <li>
        <span className="font-bold">فهم السياق:</span> 
        يتم تحليل المحتوى لفهم السياق والغرض من السؤال، مثل معرفة المادة الدراسية أو الموضوع المطلوب.
      </li>
      <li>
        <span className="font-bold">البحث عن الإجابة:</span> 
        يستخدم الروبوت قاعدة بيانات تحتوي على محتوى تعليمي شامل ونماذج ذكاء اصطناعي لإيجاد الإجابة المناسبة.
      </li>
      <li>
        <span className="font-bold">تقديم الإجابة:</span> 
        يتم تقديم الإجابة بشكل واضح ومبسط عبر النصوص أو الصوت، مع إمكانية تقديم أمثلة أو توضيحات إضافية عند الحاجة.
      </li>
      <li>
        <span className="font-bold">التفاعل المستمر:</span> 
        يمكن للروبوت متابعة النقاش والإجابة عن أسئلة إضافية بناءً على نفس السياق، مما يعزز تجربة التعلم التفاعلي.
      </li>
    </ol>
  </CardContent>
</Card>

      </main>
    </div>
  );
}
