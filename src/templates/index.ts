import type { LandingTemplate } from "@/lib/types";
import { exampleTemplateMeta } from "@/templates/example/config";

export const landingTemplates: LandingTemplate[] = [exampleTemplateMeta];

export function getTemplateBySlug(slug: string) {
    return landingTemplates.find((template) => template.slug === slug);
}
