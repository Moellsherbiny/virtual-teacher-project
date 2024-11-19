"use client";
import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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

export default function Home() {
  return (
    <div dir="rtl" className="relative container rounded mx-auto py-8 space-y-10 dark:from-blue-100 dark:to-transparent bg-gradient-to-br from-blue-50 to-blue-100 ">
      <motion.main
        className="flex flex-col items-center justify-between space-y-6 md:space-y-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Robot on the Left */}
        <motion.div
          className="flex mb-7 justify-center items-center"
          variants={itemVariants}
        >
          <Robot />
        </motion.div>

        {/* Texts on the Right */}
        <motion.section
          className="w-full text-center bg-gradient-to-tr from-blue-600 to-blue-300 rounded-xl px-6 py-8 shadow-xl"
          variants={itemVariants}
        >
          <h1 className="scroll-m-20 text-white text-xl font-extrabold tracking-tight lg:text-2xl mb-4">
            مرحبًا بك أنا روبوتك التعليمي الافتراضي
          </h1>

          <p className="text-sm md:text-xl text-white text-muted-foreground mb-6">
            اكتشف طريقة جديدة للتعلم من خلال روبوتك التعليمي الافتراضي المدعوم
            بالذكاء الاصطناعي.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link href="/chat">
              <Button variant="secondary" size="lg">
                ابدأ التعلم الآن
              </Button>
            </Link>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* Card Links Section */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
        variants={itemVariants}
      >
        {[
          { title: "الدردشة مع الروبوت", href: "/chat", icon: "💬" },
          { title: "الدورات الدراسية", href: "/courses", icon: "📚" },
          { title: "دوراتي الخاصة", href: "/my-courses", icon: "👩‍🏫" },
        ].map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center items-center"
          >
            <Card className="w-full max-w-xs shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-blue-600">{card.icon} {card.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Link href={card.href}>
                  <Button variant="secondary" size="lg" className="w-full">
                    ابدأ الآن
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="p-6 rounded-lg shadow-md dark:bg-blue- bg-white"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          لماذا تختارنا الروبوت التعليمي الافتراضي؟
        </h2>
        <ul className="space-y-3 dark:text-gray-600">
          {[
            "تقنيات ذكاء اصطناعي متقدمة للتعلم الفوري.",
            "إجابات تفاعلية على أسئلتك الأكاديمية.",
            "واجهة سهلة الاستخدام ومناسبة لجميع الأعمار.",
            "دعم متواصل على مدار الساعة.",
          ].map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-center space-x-2 space-x-reverse"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* How it Works Section */}
      <motion.section
        className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-lg"
        variants={itemVariants}
      >
        <h2 className="text-xl font-bold text-blue-700 mb-4">كيف يعمل؟</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            اختر الموضوع أو السؤال الذي تريد دراسته.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            قم بالدردشة مع روبوت الذكاء الاصطناعي للحصول على إجابات.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            استمتع بالتعلم الشخصي والتفاعلي.
          </motion.li>
        </ol>
      </motion.section>
    </div>
  );
}
