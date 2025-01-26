"use server";

import { getPopulationResponseSchema } from "@/constants/schemas";
import { env } from "@/env";

/**
 * 人口を取得
 * @param prefCode 都道府県コード
 * @returns 人口の配列
 */
export async function getPopulations(prefCode: number) {
  const res = await fetch(
    new URL(
      `api/v1/population/composition/perYear?prefCode=${prefCode}`,
      env.API_URL
    ),
    {
      headers: {
        "X-API-KEY": env.API_KEY,
      },
    }
  );

  if (!res.ok) {
    throw new Error("人工データの取得に失敗しました");
  }

  const parsedData = getPopulationResponseSchema.safeParse(await res.json());

  if (!parsedData.success) {
    throw new Error("人口データのパースに失敗しました");
  }

  return parsedData.data.result.data;
}
