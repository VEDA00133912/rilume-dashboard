import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginPage from "@/components/LoginPage";

export default async function Page() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("admin_auth");

  if (isAuthed?.value === "true") {
    redirect("/dashboard/Main");
  }

  return <LoginPage />;
}
