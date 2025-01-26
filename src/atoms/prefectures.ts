import { getPopulations } from "@/lib/actions";
import { atom } from "jotai";
import { addPrefecturePopulationsAtom } from "@/atoms/population";

interface Prefecture {
  prefCode: number;
  prefName: string;
  checked: boolean;
  fetched: boolean;
  color: string;
}

/**
 * 都道府県のアトム
 */
export const prefecturesAtom = atom<Prefecture[]>([]);

/**
 * 都道府県の人口データを取得する
 * @param prefCode 都道府県コード
 */
export const togglePrefectureAtom = atom(null, (get, set, prefCode: number) => {
  const prefectures = get(prefecturesAtom);

  // 都道府県のチェック状態を切り替え
  set(
    prefecturesAtom,
    prefectures.map((prefecture) =>
      prefecture.prefCode === prefCode
        ? { ...prefecture, checked: !prefecture.checked }
        : prefecture
    )
  );
});

/**
 * 都道府県の人口データを取得する
 * @param prefCode 都道府県コード
 */
export const fetchPrefecturePopulationsAtom = atom(
  null,
  async (get, set, prefCode: number) => {
    const prefectures = get(prefecturesAtom);
    const prefecture = prefectures.find(
      (prefecture) => prefecture.prefCode === prefCode
    );

    // 都道府県が見つからない場合は何もしない
    if (!prefecture) return;

    // 都道府県の人口データを取得
    const populations = await getPopulations(prefCode);

    // 都道府県の人口データを追加
    set(addPrefecturePopulationsAtom, {
      prefName: prefecture.prefName,
      prefCode: prefecture.prefCode,
      populations: populations,
    });

    // 都道府県のデータを取得済みに設定
    set(
      prefecturesAtom,
      prefectures.map((item) =>
        item.prefCode === prefCode ? { ...item, fetched: true } : item
      )
    );
  }
);
