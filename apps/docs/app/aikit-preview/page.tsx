import { AikitTemplate } from "@landing/templates-aikit";

/**
 * Standalone full-bleed preview cho AI-kit spike — KHÔNG qua catalog/shell.
 * Render template trực tiếp để đối chiếu fidelity với bản gốc Framer.
 */
export const metadata = {
  title: "AI-kit — Preview",
};

export default function AikitPreviewPage() {
  return <AikitTemplate />;
}
