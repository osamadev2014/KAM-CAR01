import { useState } from "react";
import { SarIcon } from "../cardetail/SarIcon";
import type { Car } from "../../lib/types";

type Props = {
  car: Car;
  images: string[];
};

export function CarCard({ car, images }: Props) {
  const [index, setIndex] = useState(0);
  const [fav, setFav] = useState(false);
  const total = images.length;
  const fmt = (n: number) => n.toLocaleString("en");

  return (
    <article className="relative w-[283px] shrink-0 overflow-hidden rounded-[8px] border border-syarah-border bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
      <div className="group relative h-[190px] w-full overflow-hidden bg-[#f3f3f3]">
        <a href={`/cars/${car.id}`} aria-label={car.title}>
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={car.title}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {total === 0 && (
            <div className="flex h-full items-center justify-center text-[14px] text-syarah-muted">
              لا توجد صور
            </div>
          )}
        </a>

        <button
          type="button"
          aria-label="أضف إلى المفضلة"
          aria-pressed={fav}
          onClick={() => setFav((v) => !v)}
          className="absolute top-[10px] left-[10px] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition hover:scale-105"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={fav ? "#2c5fb5" : "none"}
            stroke="#2c5fb5"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="الصورة السابقة"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="absolute top-1/2 right-[10px] flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-syarah-text opacity-0 shadow transition group-hover:opacity-100"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              type="button"
              aria-label="الصورة التالية"
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="absolute top-1/2 left-[10px] flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-syarah-text opacity-0 shadow transition group-hover:opacity-100"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}

        {total > 0 && (
          <div className="absolute bottom-[10px] right-[12px] flex gap-[5px]">
            {images.slice(0, Math.min(3, total)).map((_, i) => (
              <span
                key={i}
                className={`h-[9px] w-[9px] rounded-full ${
                  i === index % 3 ? "bg-[#1b1b1b]" : "bg-white/85"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <a href={`/cars/${car.id}`} className="block px-3 pt-2.5">
        <h3 className="text-[15px] font-bold text-syarah-text transition-colors hover:text-syarah-blue">
          {car.title}
        </h3>
      </a>

      <div className="mx-3 mt-2.5 flex rounded-[6px] border border-syarah-border">
        <div className="flex-1 px-3 py-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] text-syarah-muted">سعر الكاش</span>
            <span className="text-[9px] leading-none text-syarah-muted">(شامل الضريبة)</span>
          </div>
          <div className="mt-1 flex items-center justify-end gap-1 text-syarah-green">
            <SarIcon className="h-[13px] w-[13px]" />
            <span className="text-[19px] font-bold tabular-nums">{fmt(car.price_cash)}</span>
          </div>
        </div>
        <div className="w-px bg-syarah-green/60" />
        <div className="flex-1 px-3 py-2">
          <span className="text-[13px] text-syarah-muted">التقسيط</span>
          <div className="mt-1 flex items-center justify-end gap-1 text-syarah-blue">
            <span className="text-[12px]">/شهري</span>
            <SarIcon className="h-[12px] w-[12px]" />
            <span className="text-[19px] font-bold tabular-nums">
              {car.price_installment_month != null ? fmt(car.price_installment_month) : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex justify-end border-b border-syarah-border px-3 pb-2.5">
        <span className="flex items-center gap-1.5 rounded-[4px] bg-[#f4f4f4] px-2 py-[3px] text-[12px] text-syarah-text">
          {car.condition === "new" ? "جديدة" : "مستعملة"}
        </span>
      </div>

      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1.5" />
        {(car.warranty_years ?? 0) > 0 && (
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-syarah-green">
            ضمان {car.warranty_years} سنوات
          </span>
        )}
      </div>
    </article>
  );
}
