import { PieceIndexPage } from "../../../components/catalog/piece-index-page";

export const metadata = {
  title: "Templates — Landing Templates",
};

export default async function TemplatesIndexPage(
  props: PageProps<"/templates">,
) {
  return (
    <PieceIndexPage
      layer="template"
      eyebrow="Templates"
      title="Landing templates theo mood"
      searchParams={await props.searchParams}
      groupByMood
    />
  );
}
