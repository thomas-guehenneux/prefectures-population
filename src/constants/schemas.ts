import { z } from "zod";

export const getPrefecturesResponseSchema = z.object({
  result: z.array(
    z.object({
      /** 都道府県コード */
      prefCode: z.number().gte(1).lte(47),
      /** 都道府県名 */
      prefName: z.string(),
    })
  ),
});

export const labelSchema = z.enum([
  "総人口",
  "年少人口",
  "生産年齢人口",
  "老年人口",
]);

export const getPopulationResponseSchema = z.object({
  result: z.object({
    data: z.array(
      z.object({
        /** カテゴリー */
        label: labelSchema,
        data: z.array(
          z.object({
            /** 年度 */
            year: z.number(),
            /** 人口 */
            value: z.number(),
          })
        ),
      })
    ),
  }),
});
