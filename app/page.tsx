"use client";
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

export default function Home() {
  return (
    <div dir="rtl" className="container mx-auto px-4 py-8">
      <Head>
        <title>المعلم الذكي - الصفحة الرئيسية</title>
        <meta
          name="description"
          content="تعلم بسهولة مع المعلم الذكي، روبوت الدردشة التعليمي الخاص بك"
        />
      </Head>

      <motion.main
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section className="text-center" variants={itemVariants}>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            مرحبًا بك في المعلم الذكي
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            اكتشف طريقة جديدة للتعلم مع معلمك الشخصي المدعوم بالذكاء الاصطناعي
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link href="/chat">
              <Button size="lg">ابدأ التعلم الآن</Button>
            </Link>
          </motion.div>
        </motion.section>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>ميزاتنا الرئيسية</CardTitle>
              <CardDescription>اكتشف ما يميز المعلم الذكي</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "تعلم تفاعلي ومخصص",
                  "إجابات فورية على أسئلتك",
                  "تغطية لمجموعة واسعة من المواضيع",
                  "متاح 24/7 للتعلم في أي وقت",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-2 space-x-reverse"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
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
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
}
