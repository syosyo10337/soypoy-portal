import type { StaticImageData } from "next/image";
import Image from "next/image";
import filmrollLeft from "./assets/fuda_filmroll_left.webp";
import filmrollRight from "./assets/fuda_filmroll_right.webp";

/**
 * フィルムロール背景コンポーネント
 *
 * 1ユニット分の画像を2枚並べて translateY で無限スクロール。
 * transform アニメーションにより GPU 合成され repaint が発生しない。
 */
export default function FudaFilmRollBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-between items-stretch z-0">
      {/* 左側のフィルムロール */}
      <FilmRollStrip image={filmrollLeft} />

      {/* 中央の空白スペース */}
      <div className="grow" />

      {/* 右側のフィルムロール */}
      <FilmRollStrip image={filmrollRight} />
    </div>
  );
}

function FilmRollStrip({ image }: { image: StaticImageData }) {
  return (
    <div className="shrink-0 w-7 md:w-13 overflow-hidden">
      <div className="film-roll-scroll">
        {/* 3枚並べて4Kディスプレイでもカバー */}
        <Image
          src={image}
          alt=""
          preload
          className="block w-full h-auto"
        />
        <Image src={image} alt="" loading="eager" className="block w-full h-auto" />
        <Image src={image} alt="" loading="eager" className="block w-full h-auto" />
      </div>
    </div>
  );
}
