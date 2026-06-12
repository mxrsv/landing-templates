import { PieceIndexPage } from "../../../components/catalog/piece-index-page";

export const metadata = {
  title: "UI — Landing Templates",
};

export default async function UiIndexPage(props: PageProps<"/ui">) {
  return (
    <PieceIndexPage
      layer="ui"
      eyebrow="UI"
      title="UI components copy-paste"
      searchParams={await props.searchParams}
    />
  );
}
