"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { categoryAtom } from "@/atoms/category";
import { populationsAtom } from "@/atoms/population";
import { prefecturesAtom } from "@/atoms/prefectures";
import { useAtomValue } from "jotai";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useMemo } from "react";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-white p-2 shadow-md">
      <p className="text-sm font-semibold">{label}年</p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-x-2 text-xs"
            style={{ color: entry.color }}
          >
            <span
              className="h-0.5 w-4"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span>{entry.name}</span>
            <span>
              {(entry.value
                ? Math.floor(Number(entry.value) / 1_0000)
                : 0
              ).toLocaleString()}
              万人
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function PopulationChart() {
  const prefectures = useAtomValue(prefecturesAtom);
  const category = useAtomValue(categoryAtom);
  const populations = useAtomValue(populationsAtom);
  const checkedPrefectures = prefectures.filter(
    (prefecture) => prefecture.checked
  );
  const keys =
    populations[category]?.length > 0
      ? Object.keys(populations[category][0]).filter((key) => key !== "year")
      : [];

  const isChecked = useMemo(
    () => (key: string) =>
      checkedPrefectures.some((prefecture) => prefecture.prefName === key),
    [checkedPrefectures]
  );

  // 都道府県が選択されていない場合
  if (!prefectures.some((prefecture) => prefecture.checked)) {
    return <p className="text-lg">都道府県を選択してください。</p>;
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
      className="rounded-lg border border-slate-600 opacity-100 transition-opacity duration-500 starting:opacity-0"
    >
      <LineChart
        data={populations[category]}
        accessibilityLayer
        margin={{ top: 20, right: 16, bottom: 20, left: 16 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickFormatter={(value) => Math.floor(value / 10000).toLocaleString()}
          tickLine={false}
          tick={{ fontSize: 11 }}
          label={{
            value: "人口数(万人)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 11 },
          }}
        />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Legend align="left" wrapperStyle={{ fontSize: 11 }} />
        {keys.map((key) => (
          <Line
            key={key}
            id={`line-${category}-${key}`}
            type="natural"
            dataKey={key}
            name={key}
            stroke={
              checkedPrefectures.find(
                (prefecture) => prefecture.prefName === key
              )?.color
            }
            legendType={isChecked(key) ? "line" : "none"}
            hide={isChecked(key) ? false : true}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
