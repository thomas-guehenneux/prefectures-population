import { CategorySelection } from "@/components/category-selection";
import { PopulationChart } from "@/components/population-chart";
import { PrefecturesSelection } from "@/components/prefectures-selection";

export default function Home() {
  return (
    <div className="container mx-auto p-2">
      <h1 className="mb-8 text-center text-2xl font-bold">
        都道府県別の人口推移グラフ
      </h1>
      <div className="space-y-4">
        <PrefecturesSelection />
        <CategorySelection />
        <PopulationChart />
      </div>
    </div>
  );
}
