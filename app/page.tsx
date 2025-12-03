import { redirect } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  <LoadingScreen />;
  redirect("/login");
}
