import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateModuleForm } from "@/components/dashboard/course/module/create-module-form";

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function CreateModulePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const {id} = await params
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-6">
        Create New Module
      </h1>

      <CreateModuleForm courseId={id} />
    </div>
  );
}
