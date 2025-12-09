"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react";

export default function ContactPage() {
  const  t  = useTranslations("contact"); // استخدم نفس namespace الموجود في ملفات JSON
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setLoading(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("infoEmail"),
      content: "magdygad2006@gmail.com",
      link: "mailto:support@edubot.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: t("infoPhone"),
      content: "+20 100 098 5457",
      link: "tel:+201000985457",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: t("infoAddress"),
      content: "القاهرة، مصر",
      link: "https://maps.google.com",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: t("infoWorkHours"),
      content: "السبت - الخميس: 9 صباحًا - 5 مساءً",
      link: null,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const socialLinks = [
    { icon: Facebook, link: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Twitter, link: "#", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Instagram, link: "#", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Linkedin, link: "#", label: "LinkedIn", color: "hover:text-blue-700" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" >
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2">
            <MessageSquare className="w-4 h-4 ml-2" />
            {t("titleBadge")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            {t("headerTitle")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("headerDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("infoTitle")}
            </h2>
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const content = info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {info.content}
                </a>
              ) : (
                <span>{info.content}</span>
              );

              return (
                <Card
                  key={index}
                  className="group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {info.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  {t("formTitle")}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("formDesc")}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("name")} <span className="text-red-500">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t("placeholder.name")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("email")} <span className="text-red-500">{t("required")}</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t("placeholder.email")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("subject")} <span className="text-red-500">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t("placeholder.subject")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("message")} <span className="text-red-500">{t("required")}</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={t("placeholder.message")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Status Messages */}
                  {status === "success" && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{t("status.success")}</p>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{t("status.error")}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    size="lg"
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        {t("submit")}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 text-white border-0">
          <CardContent className="p-8 md:p-12 text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              {t("faqTitle")}
            </h3>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {t("faqDesc")}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
            >
              {t("faqButton")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
