import assets from "@/data/assets";
import { redirect } from "next/navigation";

export default function page() {
  return redirect(assets.resumePage);
}
