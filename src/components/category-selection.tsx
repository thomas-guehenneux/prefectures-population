"use client";

import { changeCategoryAtom } from "@/atoms/category";
import { useSetAtom } from "jotai";
import { labelSchema } from "@/constants/schemas";

export function CategorySelection() {
  const setCategory = useSetAtom(changeCategoryAtom);

  return (
    <select
      onChange={(e) => setCategory(e.currentTarget.value)}
      className="flex h-10 rounded-lg border bg-white p-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    >
      {Object.values(labelSchema.enum).map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
}
