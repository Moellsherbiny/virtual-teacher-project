"use client";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/apiHandler";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";


type Question = {
  text: string;
  options: string[];
  correctAnswer: string;
};

type QuizProps = {
  quiz: {
    questions: Question[];
  };
};

const QuestionBlock = ({
  question,
  index,
  selectedAnswer,
  handleAnswerSelection,
}: {
  question: Question;
  index: number;
  selectedAnswer: string;
  handleAnswerSelection: (answer: string, index: number) => void;
}) => (
  <div key={index} className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
      {question.text}
    </h2>
    <ul className="space-y-3">
      {question.options.map((option, optionIndex) => (
        <li key={optionIndex}>
          <label className="flex items-center space-x-2 space-x-reverse">
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => handleAnswerSelection(option, index)}
              className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-400"
            />
            <span className="text-gray-700 dark:text-white/80">{option}</span>
          </label>
        </li>
      ))}
    </ul>
  </div>
);

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quizData, setQuizData] = useState<QuizProps["quiz"] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axiosInstance.post("/generation/quiz", {
          id: params.id,
        }); 
        const data = await response.data;
        setQuizData(data.quiz);
        setSelectedAnswers(new Array(data.quiz.questions.length).fill(""));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load quiz data.");
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [params.id]);

  // Handle answer selection
  const handleAnswerSelection = (answer: string, index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = answer;
    setSelectedAnswers(newAnswers);
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setShowResults(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!quizData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        No quiz data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-8 " dir="rtl">
      <Button variant="ghost" asChild className="mb-6 hover:text-red-600">
          <Link href='/my-courses/'>
            <ArrowRight className="ml-2  h-4 w-4" /> الخروج
          </Link>
        </Button>
        <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-blue-600">
          اختبار
        </h1>

        {quizData.questions.map((question, index) => (
          <QuestionBlock
            key={index}
            question={question}
            index={index}
            selectedAnswer={selectedAnswers[index]}
            handleAnswerSelection={handleAnswerSelection}
          />
        ))}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            إرسال
          </Button>
        </div>

        {showResults && (
          <Dialog>
            <DialogTrigger asChild className="flex w-full justify-center">
              <Button variant="secondary" className="my-4 w-fit mx-auto">
                عرض النتائج
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md text-right max-h-[80vh] overflow-y-auto">
              <DialogHeader className="text-right">
                <DialogTitle className="text-center">النتائج</DialogTitle>
                <DialogDescription className="text-center">
                  نتائج الاختبار
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {quizData.questions.map((question, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                      {question.text}
                    </h3>
                    <p
                      className={`${
                        selectedAnswers[index] === question.correctAnswer
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      إجابتك: {selectedAnswers[index]}
                    </p>
                    {selectedAnswers[index] !== question.correctAnswer && (
                      <p className="text-blue-600">
                        الإجابة الصحيحة: {question.correctAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter className="sm:justify-center">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    إغلاق
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
