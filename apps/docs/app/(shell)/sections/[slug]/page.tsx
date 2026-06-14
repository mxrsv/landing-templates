import { redirect } from "next/navigation";

/** Route detail cũ → Unified Explorer deep-link `?piece=` (spec §6). */
export default async function SectionDetailRedirect(
  props: PageProps<"/sections/[slug]">,
) {
  const { slug } = await props.params;
  redirect(`/?piece=${slug}`);
}
