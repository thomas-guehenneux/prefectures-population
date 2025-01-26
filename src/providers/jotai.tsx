"use client";

import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { prefecturesAtom } from "@/atoms/prefectures";
import type { getPrefectures } from "@/lib/data";
import type { ReactNode } from "react";
import { generateRandomColors } from "@/utils";

type Props = {
  prefectures: Awaited<ReturnType<typeof getPrefectures>>;
  children: ReactNode;
};

const HydrateAtoms = ({ prefectures, children }: Props) => {
  const colors = generateRandomColors(prefectures.length);
  const initialState = prefectures.map((prefecture, index) => ({
    ...prefecture,
    checked: false,
    fetched: false,
    populations: [],
    color: colors[index],
  }));

  useHydrateAtoms([[prefecturesAtom, initialState]]);

  return children;
};

export default function Provider({ prefectures, children }: Props) {
  return (
    <JotaiProvider>
      <HydrateAtoms prefectures={prefectures}>{children}</HydrateAtoms>
    </JotaiProvider>
  );
}
