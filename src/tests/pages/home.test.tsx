import { labelSchema } from "@/constants/schemas";
import { test, expect } from "@playwright/test";
import type { z } from "zod";

test.describe("CheckboxとRecharts Lineのテスト", () => {
  const defaultCategory = labelSchema.Enum.総人口;
  const otherCategory = labelSchema.Enum.年少人口;

  /**
   * 線のIDを取得する関数
   * @param {Object} params - 関数のパラメータ
   * @param {z.infer<typeof labelSchema>} params.category - カテゴリー
   * @param {string} params.index - チェックボックスID
   */
  function getLineId({
    category,
    index,
  }: {
    category: z.infer<typeof labelSchema>;
    index: string;
  }) {
    return `#line-${category}-${index}`;
  }

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ホームページにチェックボックスが表示されるか確認", async ({ page }) => {
    const checkboxesCount = await page
      .locator('input[type="checkbox"]')
      .count();

    // チェックボックスが1つ以上表示されていることを確認
    await expect(checkboxesCount).toBeGreaterThan(0);
  });

  test("チェックボックスをチェックするとRechartsの線が表示されるか確認", async ({
    page,
  }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const checkboxId = await checkbox.getAttribute("id");

    if (!checkboxId) {
      throw new Error("チェックボックスが見つかりませんでした");
    }

    // チェックボックスをチェック
    await checkbox.check();

    const line = page.locator(
      getLineId({ category: defaultCategory, index: checkboxId })
    );

    // 線が表示されていることを確認
    await expect(line).toBeVisible();
  });

  test("チェックボックスを外すとRechartsの線が非表示になるか確認", async ({
    page,
  }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const checkboxId = await checkbox.getAttribute("id");

    if (!checkboxId) {
      throw new Error("チェックボックスが見つかりませんでした");
    }

    // チェックボックスをチェックしてから外す
    await checkbox.check();
    await checkbox.uncheck();

    const line = page.locator(
      getLineId({ category: defaultCategory, index: checkboxId })
    );
    // 線が非表示であることを確認
    await expect(line).not.toBeVisible();
  });

  test("現在のカテゴリーの線を表示し、カテゴリーを変更すると別のカテゴリーの線が表示されるべき", async ({
    page,
  }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const checkboxId = await checkbox.getAttribute("id");

    if (!checkboxId) {
      throw new Error("チェックボックスが見つかりませんでした");
    }

    // チェックボックスをチェック
    await checkbox.check();

    // 線が表示されていることを確認
    const line = page.locator(
      getLineId({ category: defaultCategory, index: checkboxId })
    );
    await expect(line).toBeVisible();

    // カテゴリーを変更
    const select = page.locator("select");
    await select.selectOption({ label: otherCategory });

    // 元の線が非表示であることを確認
    await expect(line).not.toBeVisible();

    const newLine = page.locator(
      getLineId({ category: otherCategory, index: checkboxId })
    );

    // 新しい線が表示されていることを確認
    await expect(newLine).toBeVisible();
  });
});
