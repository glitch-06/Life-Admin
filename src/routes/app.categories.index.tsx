import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { CategoryCard } from "@/components/cards";
import { categories, categoryItemCounts } from "@/lib/mock-data";

export const Route = createFileRoute("/app/categories/")({
  head: () => ({
    meta: [
      { title: "Categories — Life Admin" },
      { name: "description", content: "Browse your information by the part of life it belongs to." },
      { property: "og:title", content: "Categories — Life Admin" },
      { property: "og:description", content: "Browse your information by area of life." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Your information, grouped by area of life." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            count={categoryItemCounts[category.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
