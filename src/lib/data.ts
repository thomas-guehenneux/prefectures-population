import "server-only";
import { env } from "@/env";
import { getPrefecturesResponseSchema } from "@/constants/schemas";

/**
 * 都道府県を取得
 * @returns 都道府県の配列
 */
export async function getPrefectures() {
  const res = await fetch(new URL(`api/v1/prefectures`, env.API_URL), {
    headers: {
      "X-API-KEY": env.API_KEY,
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("都道府県データの取得に失敗しました");
  }

  const parsedData = getPrefecturesResponseSchema.safeParse(await res.json());

  if (!parsedData.success) {
    throw new Error("都道府県データのパースに失敗しました");
  }

  return parsedData.data.result;
}
