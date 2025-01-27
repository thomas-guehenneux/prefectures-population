"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  prefecturesAtom,
  togglePrefectureAtom,
  fetchPrefecturePopulationsAtom,
} from "@/atoms/prefectures";

export function PrefecturesSelection() {
  const prefectures = useAtomValue(prefecturesAtom);
  const togglePrefecture = useSetAtom(togglePrefectureAtom);
  const fetchPrefecturePopulations = useSetAtom(fetchPrefecturePopulationsAtom);

  const handleToggle = (prefCode: number) => {
    togglePrefecture(prefCode);
    const prefecture = prefectures.find(
      (prefecture) => prefecture.prefCode === prefCode
    );
    if (prefecture && !prefecture.fetched) {
      fetchPrefecturePopulations(prefCode);
    }
  };

  return (
    <ul className="grid grid-cols-3 md:grid-cols-5">
      {prefectures.map((prefecture) => (
        <li key={prefecture.prefCode} className="flex items-center gap-x-1.5">
          <input
            type="checkbox"
            id={prefecture.prefName}
            name={prefecture.prefName}
            value={prefecture.prefCode}
            onChange={() => handleToggle(prefecture.prefCode)}
            className="size-4 checked:bg-sky-600"
          />
          <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
        </li>
      ))}
    </ul>
  );
}
