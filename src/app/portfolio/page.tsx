import { PortfolioCategorySection } from "../components/beyondlab/PortfolioCategorySection";
import { portfolioCategories } from "../components/beyondlab/data";

export const metadata = {
  title: "Projects | BeyondLab",
  description: "รวบรวมโปรเจกต์ เดโม คอร์ส และกรณีศึกษาของ BeyondLab",
};

export default function PortfolioPage() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-[#ea721f]">Projects</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#303030] sm:text-5xl">โปรเจกต์ของ BeyondLab</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            รวมผลงาน คอร์ส โปรดักต์ และกรณีศึกษาที่ BeyondLab มีส่วนช่วยออกแบบ สอน ให้คำปรึกษา
            หรือพัฒนาเป็นเครื่องมือใช้งานจริง
          </p>
        </div>

        <div className="space-y-10">
          {portfolioCategories.map((category) => (
            <PortfolioCategorySection key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
