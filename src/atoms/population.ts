import { atom } from "jotai";

interface Prefecture {
  prefCode: number;
  prefName: string;
  populations: {
    label: string;
    data: {
      year: number;
      value: number;
    }[];
  }[];
}

interface PopulationByCategory {
  [category: string]: {
    year: number;
    [prefName: string]: number;
  }[];
}

/**
 * カテゴリごとの都道府県の人口データを保持するアトム
 */
export const populationsAtom = atom<PopulationByCategory>({});

/**
 * 都道府県の人口データを追加するアトム
 * @param newPrefecture 新しい都道府県
 */
export const addPrefecturePopulationsAtom = atom(
  null,
  (get, set, newPrefecture: Prefecture) => {
    const currentPopulation = get(populationsAtom);
    const { prefName, populations } = newPrefecture;

    // 全てのカテゴリを繰り返して新しい状態を作成
    const updatedPopulation = { ...currentPopulation };

    populations.forEach(({ label, data }) => {
      // 状態にカテゴリが存在することを確認
      if (!updatedPopulation[label]) {
        updatedPopulation[label] = [];
      }

      // 各年の人口データを追加
      data.forEach(({ year, value }) => {
        // 既存の年のエントリを見つけるか、新しいものを作成
        let yearEntry = updatedPopulation[label].find(
          (entry) => entry.year === year
        );
        if (!yearEntry) {
          yearEntry = { year };
          updatedPopulation[label].push(yearEntry);
        }

        // 都道府県の人口値を追加
        yearEntry[prefName] = value;
      });

      // カテゴリ内の年をソート
      updatedPopulation[label].sort((a, b) => a.year - b.year);
    });

    set(populationsAtom, updatedPopulation);
  }
);
