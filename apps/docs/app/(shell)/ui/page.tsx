import { redirect } from "next/navigation";

/** Route cũ → Unified Explorer (spec §6). `/ui/shapes` + `/ui/surfaces` giữ nguyên. */
export default function UiIndexRedirect() {
  redirect("/?layer=ui");
}
