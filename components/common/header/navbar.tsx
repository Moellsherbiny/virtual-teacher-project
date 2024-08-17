import { getServerSession } from "next-auth";
import PublicNav from "@/components/common/header/publicNav";
import UserNav from "./userNav";
interface User {
  user: { name: string; image: string };
}
export default async function Header() {
  const session = await getServerSession();

  if (!session) return <PublicNav />;

  return (
    <UserNav
      user={{
        name: session.user.name,
        image: session.user.image,
      }}
    />
  );
}
