import { PortfolioGrid } from "../components/beyondlab/PortfolioGrid";
import { portfolioCategories } from "../components/beyondlab/data";

export const metadata = {
  title: "Projects | BeyondLab",
  description: "รวบรวมโปรเจกต์ เดโม คอร์ส และกรณีศึกษาของ BeyondLab",
};

export default function PortfolioPage() {
  const projects = portfolioCategories.flatMap((category) => category.items);

  return (
    <section className="bg-[#f7f3ed] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 text-center">
          <p className="text-sm font-semibold text-[#ea721f]">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#303030] sm:text-4xl">โปรเจกต์ของ BeyondLab</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            รวมผลงาน คอร์ส โปรดักต์ และกรณีศึกษาที่ BeyondLab มีส่วนช่วยออกแบบ สอน ให้คำปรึกษา
            หรือพัฒนาเป็นเครื่องมือใช้งานจริง
          </p>
        </div>
        <PortfolioGrid items={projects} />
      </div>
    </section>
  );
}
