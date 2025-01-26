import { CategorySelection } from "@/components/category-selection";
import { PopulationChart } from "@/components/population-chart";
import { PrefecturesSelection } from "@/components/prefectures-selection";

export default function Home() {
  return (
    <div className="container mx-auto space-y-4 p-2">
      <PrefecturesSelection />
      <CategorySelection />
      <PopulationChart />
    </div>
  );
}
