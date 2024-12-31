import { redirect } from "next/navigation";

import assets from "@/data/assets";

export default function page() {
  return redirect(assets.resumePage);
}
