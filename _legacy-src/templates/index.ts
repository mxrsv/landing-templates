import type { LandingTemplate } from "@/lib/types";
import { exampleTemplateMeta } from "@/templates/example/config";
import { ternusTemplateMeta } from "@/templates/ternus/config";

export const landingTemplates: LandingTemplate[] = [
  exampleTemplateMeta,
  ternusTemplateMeta,
];

export function getTemplateBySlug(slug: string) {
  return landingTemplates.find((template) => template.slug === slug);
}
