import { CategorySelection } from "@/components/category-selection";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  within,
  cleanup,
} from "@testing-library/react";
import { labelSchema } from "@/constants/schemas";
import * as jotai from "jotai";

vi.mock("jotai", async (importOriginal) => {
  const original = await importOriginal<typeof jotai>();
  return {
    ...original,
    useSetAtom: vi.fn(),
  };
});

describe("CategorySelection", () => {
  const mockSetCategory = vi.fn();

  beforeEach(() => {
    vi.mocked(jotai.useSetAtom).mockReturnValue(mockSetCategory);
    render(<CategorySelection />);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("カテゴリー選択が正しいオプションとデフォルトオプションで表示される", () => {
    const select = screen.getByRole("combobox");
    const options = within(select).getAllByRole("option");

    // オプションの数が正しいことを確認
    Object.values(labelSchema.enum).forEach((label, index) => {
      expect(options[index].getAttribute("value")).toBe(label);
      expect(options[index].textContent).toBe(label);
    });

    const selected = within(select).getByRole("option", { selected: true });

    // デフォルトで選択されているオプションが正しいことか確認
    expect(selected.textContent).toBe(labelSchema.enum.総人口);
  });

  test("カテゴリー選択を変更し、setCategoryが呼び出される", () => {
    const select = screen.getByRole("combobox");
    fireEvent.change(select, {
      target: { value: labelSchema.enum.生産年齢人口 },
    });

    // ドロップダウンが変更されたことでsetCategoryが呼び出されるか確認
    expect(mockSetCategory).toHaveBeenCalledWith(labelSchema.enum.生産年齢人口);

    const selected = within(select).getByRole("option", { selected: true });

    // 選択されているオプションが正しいことか確認
    expect(selected.textContent).toBe(labelSchema.enum.生産年齢人口);
  });
});
