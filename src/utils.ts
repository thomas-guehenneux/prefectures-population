/**
 * 色をランダムに生成する関数
 * @param number - 生成する色の数
 * @returns string[] - ランダムに生成された色の配列
 */
export function generateRandomColors(number: number) {
  const colors = [];

  for (let i = 0; i < number; i++) {
    // 制限された範囲でランダムなRGB値を生成
    const r = Math.floor(Math.random() * 128) + 64;
    const g = Math.floor(Math.random() * 128) + 64;
    const b = Math.floor(Math.random() * 128) + 64;

    // RGB値を16進数に変換
    const randomColor = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    colors.push(randomColor);
  }

  return colors;
}
