import { PieceIndexPage } from "../../../components/catalog/piece-index-page";

export const metadata = {
  title: "Sections — Landing Templates",
};

export default async function SectionsIndexPage(props: PageProps<"/sections">) {
  return (
    <PieceIndexPage
      layer="section"
      eyebrow="Sections"
      title="Section ghép trang landing"
      searchParams={await props.searchParams}
    />
  );
}
