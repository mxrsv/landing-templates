import { TemplateCard } from "@/components/template-card";
import { landingTemplates } from "@/templates";

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
                <section className="max-w-3xl">
                    <p className="text-sm font-medium tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">
                        Landing Templates
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Thư viện landing page, template và components
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Repo này lưu các page demo, template tái sử dụng và components dùng chung. Thêm template mới vào{" "}
                        <code className="text-sm">src/templates</code>, preview qua route demo, rồi copy sang project
                        khách hàng khi cần.
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    {landingTemplates.map((template) => (
                        <TemplateCard key={template.slug} template={template} />
                    ))}
                </section>
            </main>
        </div>
    );
}
