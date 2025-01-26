import { PopulationChart } from "@/components/population-chart";
import { expect, test, describe, vi, afterEach, beforeEach } from "vitest";
import { useAtomValue } from "jotai";
import { prefecturesAtom } from "@/atoms/prefectures";
import { categoryAtom } from "@/atoms/category";
import { populationsAtom } from "@/atoms/population";
import { ResponsiveContainerProps } from "recharts";
import { labelSchema } from "@/constants/schemas";
import { render, cleanup } from "vitest-browser-react";

vi.mock("jotai", async (importOriginal) => {
  const original = await importOriginal<typeof import("jotai")>();
  return {
    ...original,
    useAtomValue: vi.fn(),
  };
});

vi.mock("recharts", async (importOriginal) => {
  const mockRecharts = await importOriginal<typeof import("recharts")>();
  return {
    ...mockRecharts,
    ResponsiveContainer: ({ width, children }: ResponsiveContainerProps) => (
      <mockRecharts.ResponsiveContainer width={width || "100%"} height={800}>
        {children}
      </mockRecharts.ResponsiveContainer>
    ),
  };
});

describe("PopulationChart", () => {
  const mockPrefectures = [
    { prefCode: 1, prefName: "北海道", checked: false, color: "red" },
    { prefCode: 2, prefName: "青森県", checked: false, color: "blue" },
  ];
  const mockCategory = labelSchema.Enum.総人口.toString();

  const mockPopulations = {
    [mockCategory]: [
      { year: 2000, 北海道: 500000, 青森県: 300000 },
      { year: 2001, 北海道: 520000, 青森県: 310000 },
    ],
  };

  beforeEach(() => {
    cleanup();
    vi.mocked(useAtomValue).mockImplementation((atom) => {
      switch (atom) {
        case prefecturesAtom:
          return mockPrefectures;
        case categoryAtom:
          return mockCategory;
        case populationsAtom:
          return mockPopulations;
        default:
          return undefined;
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("すべてのデータがチェックされている場合にモックデータでPopulationChartが描画される", async () => {
    // すべてのデータをチェックする
    mockPrefectures.map((prefecture) => (prefecture.checked = true));
    render(<PopulationChart />);

    const keys = Object.keys(mockPopulations[mockCategory][0]).filter(
      (key) => key !== "year"
    );

    const lines = keys
      .map((key) => document.querySelector(`#line-${mockCategory}-${key}`))
      .filter(Boolean);

    expect(lines).toHaveLength(mockPrefectures.length);
  });

  test("最初のデータ以外がチェックされている場合にモックデータでPopulationChartが描画される", async () => {
    // 最初のデータ以外をチェックする
    mockPrefectures.map(
      (prefecture, index) => (prefecture.checked = index !== 0)
    );

    render(<PopulationChart />);

    const keys = Object.keys(mockPopulations[mockCategory][0]).filter(
      (key) => key !== "year"
    );

    const lines = keys
      .map((key) => document.querySelector(`#line-${mockCategory}-${key}`))
      .filter(Boolean);

    expect(lines).toHaveLength(mockPrefectures.length - 1);
  });
});
