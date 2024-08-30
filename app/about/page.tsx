import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div dir="rtl" className="container mx-auto  py-12 space-y-12">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight text-center lg:text-5xl text-primary mb-12">
        عن الروبوت الافتراضي
      </h1>
      <main className="space-y-12">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-muted-foreground">
              من نحن
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed  dark:text-gray-200">
              الروبوت الافتراضي هو منصة تعليمية مبتكرة تستخدم تقنيات الذكاء
              الاصطناعي لتوفير تجربة تعلم شخصية وتفاعلية. هدفنا هو جعل التعليم
              متاحًا وفعالًا لجميع الطلاب، بغض النظر عن مستواهم أو خلفيتهم.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-muted-foreground">
              كيف يعمل
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed dark:text-gray-200">
              يستخدم الروبوت الافتراضي نماذج لغوية متقدمة لفهم أسئلتك وتقديم
              إجابات دقيقة ومفصلة. يمكنه التكيف مع أسلوب تعلمك وتقديم شروحات
              إضافية عند الحاجة.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-muted-foreground">
              مميزات الروبوت الافتراضي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="my-6 mr-6 list-disc text-lg leading-relaxed dark:text-gray-200 space-y-2">
              {[
                "دعم لمجموعة واسعة من المواد الدراسية",
                "تفاعل طبيعي وسهل الاستخدام",
                "تتبع التقدم وتقارير الأداء",
                "تمارين وأسئلة تفاعلية",
                "دعم متعدد اللغات",
              ].map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
