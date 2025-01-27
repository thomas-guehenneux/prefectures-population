import { labelSchema } from "@/constants/schemas";
import { atom } from "jotai";

/**
 * カテゴリーのアトム
 */
export const categoryAtom = atom<string>(labelSchema.enum.総人口);

/**
 * カテゴリーを切り替えるアトム
 */
export const changeCategoryAtom = atom(null, (_get, set, arg: string) => {
  set(categoryAtom, arg);
});
