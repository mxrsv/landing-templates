import { PieceIndexPage } from "../../components/catalog/piece-index-page";

export const metadata = {
  title: "Templates — Landing Templates",
};

export default function TemplatesIndexPage() {
  return (
    <PieceIndexPage
      layer="template"
      eyebrow="Templates"
      title="Landing templates theo mood"
      groupByMood
    />
  );
}
