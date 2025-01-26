import { PrefecturesSelection } from "@/components/prefectures-selection";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  prefecturesAtom,
  togglePrefectureAtom,
  fetchPrefecturePopulationsAtom,
} from "@/atoms/prefectures";

vi.mock("jotai", async (importOriginal) => {
  const original = await importOriginal<typeof import("jotai")>();
  return {
    ...original,
    useAtomValue: vi.fn(),
    useSetAtom: vi.fn(),
  };
});

describe("PrefecturesSelection", () => {
  const mockTogglePrefecture = vi.fn();
  const mockFetchPrefecturePopulations = vi.fn();
  const initialPrefectures = [
    {
      prefCode: 1,
      prefName: "北海道",
      checked: false,
      fetched: false,
      color: "red",
    },
    {
      prefCode: 2,
      prefName: "青森県",
      checked: false,
      fetched: false,
      color: "blue",
    },
  ];
  let mockPrefectures = initialPrefectures;

  beforeEach(() => {
    mockPrefectures = [...initialPrefectures];
    vi.mocked(useAtomValue).mockImplementation((atom) => {
      if (atom === prefecturesAtom) {
        return mockPrefectures;
      }
      return undefined;
    });

    vi.mocked(useSetAtom).mockImplementation((atom) => {
      if (atom === togglePrefectureAtom) {
        return (prefCode) => {
          mockTogglePrefecture(prefCode);
          mockPrefectures = mockPrefectures.map((prefecture) =>
            prefecture.prefCode === prefCode
              ? { ...prefecture, checked: !prefecture.checked }
              : prefecture
          );
        };
      }
      if (atom === fetchPrefecturePopulationsAtom) {
        return (prefCode) => {
          mockFetchPrefecturePopulations(prefCode);
          mockPrefectures = mockPrefectures.map((prefecture) =>
            prefecture.prefCode === prefCode
              ? { ...prefecture, fetched: true }
              : prefecture
          );
        };
      }
      return vi.fn();
    });

    render(<PrefecturesSelection />);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("都道府県選択が正しいオプションでレンダリングされる", () => {
    const checkboxes = screen.getAllByRole("checkbox");
    mockPrefectures.forEach((prefecture, index) => {
      const checkbox = checkboxes[index] as HTMLInputElement;

      // チェックボックスが正しい値とチェック状態でレンダリングされているか確認
      expect(checkbox.value).toBe(prefecture.prefCode.toString());
      expect(checkbox.checked).toBe(prefecture.checked);
    });
  });

  test("チェックボックスがトグルされたときにtogglePrefectureAtomが呼び出される", () => {
    const checkboxes = screen.getAllByRole("checkbox");
    const targetPrefecture = mockPrefectures[0];

    fireEvent.click(checkboxes[0]);

    // togglePrefectureAtomが呼び出されたか確認
    expect(mockTogglePrefecture).toHaveBeenCalledWith(
      targetPrefecture.prefCode
    );
  });

  test("チェックボックスをクリックしたときにfetchPrefecturePopulationsAtomが呼び出される", () => {
    // 最初にチェックボックス要素を取得
    const checkboxes = screen.getAllByRole("checkbox");
    const targetPrefectureToFetch = mockPrefectures[0];

    // 最初のチェックボックスにクリックイベントをトリガー
    fireEvent.click(checkboxes[0]);

    // fetchPrefecturePopulationsAtomが呼び出されたか確認
    expect(mockFetchPrefecturePopulations).toHaveBeenCalledWith(
      targetPrefectureToFetch.prefCode
    );

    // fetchedフラグがtrueに設定されているか確認
    expect(mockPrefectures[0].checked).toBe(true);
  });

  test("すでに取得済みの都道府県にはfetchPrefecturePopulationsAtomを呼び出さない", () => {
    mockPrefectures = mockPrefectures.map((prefecture) => ({
      ...prefecture,
      fetched: true,
    }));

    cleanup();
    render(<PrefecturesSelection />);

    const checkboxes = screen.getAllByRole("checkbox");

    // 1番目のチェックボックスをクリック
    fireEvent.click(checkboxes[0]);

    // fetchPrefecturePopulationsAtomが呼び出されないことを確認
    expect(mockFetchPrefecturePopulations).not.toHaveBeenCalled();
  });
});
