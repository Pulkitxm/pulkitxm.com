import { redirect } from "next/navigation";

import profile from "@/data/profile";

export default function page() {
  return redirect(profile.resumeLink);
}
