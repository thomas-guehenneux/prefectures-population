import { labelSchema } from "@/constants/schemas";
import { atom } from "jotai";

/**
 * カテゴリのアトム
 */
export const categoryAtom = atom<string>(labelSchema.enum.総人口);

/**
 * カテゴリを切り替えるアトム
 */
export const changeCategoryAtom = atom(null, (_get, set, arg: string) => {
  set(categoryAtom, arg);
});
