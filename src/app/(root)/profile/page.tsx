import { redirect } from "next/navigation";

export default function ProfilePage() {
  // Temporarily redirect to safe profile page to avoid React Context errors
  redirect("/profile-safe");
}
