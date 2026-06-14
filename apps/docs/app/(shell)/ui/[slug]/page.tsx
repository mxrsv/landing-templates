import { redirect } from "next/navigation";

/** Route detail cũ → Unified Explorer deep-link `?piece=` (spec §6). */
export default async function UiDetailRedirect(props: PageProps<"/ui/[slug]">) {
  const { slug } = await props.params;
  redirect(`/?piece=${slug}`);
}
