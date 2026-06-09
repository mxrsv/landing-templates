import Link from "next/link";
import type { LandingTemplate } from "@/lib/types";
import { TemplatePreviewFrame } from "@/components/template-preview-frame";

type TemplateCardProps = {
  template: LandingTemplate;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      href={template.previewPath}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Preview ${template.name}`}
      className="group block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mb-5">
        <TemplatePreviewFrame
          src={template.previewPath}
          title={`Preview ${template.name}`}
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {template.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {template.name}
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {template.description}
      </p>
      <span className="mt-6 inline-flex text-sm font-medium text-violet-600 transition group-hover:text-violet-500 dark:text-violet-300">
        Preview template →
      </span>
    </Link>
  );
}
