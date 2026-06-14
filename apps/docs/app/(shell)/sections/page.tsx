import { redirect } from "next/navigation";

/** Route cũ → Unified Explorer (spec §6). */
export default function SectionsIndexRedirect() {
  redirect("/?layer=section");
}
