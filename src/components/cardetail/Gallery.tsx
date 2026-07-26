import { useCallback, useEffect, useState } from "react";
import { assets } from "../../data/listing";

type Props = {
  images: string[];
  title: string;
};

export function Gallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const total = images.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
      if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    document.body.style.overflow = zoom ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoom]);

  return (
    <>
      <div className="overflow-hidden rounded-[8px]">
        <div className="group relative aspect-[16/9] w-full overflow-hidden bg-[#f3f3f3]">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${title} `}
              loading={i === 0 ? "eager" : "lazy"}
              onClick={() => setZoom(true)}
              className={`absolute inset-0 h-full w-full cursor-pointer object-cover transition-opacity duration-300 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />
          ))}

          <button
            type="button"
            aria-label="السابق"
            onClick={prev}
            className="absolute top-1/2 right-[14px] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-syarah-text shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="التالي"
            onClick={next}
            className="absolute top-1/2 left-[14px] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-syarah-text shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-black/45 to-transparent pb-3 pt-10 text-white">
            <span className="flex items-center gap-1.5 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              اضغط لتكبير الصورة
            </span>
            <span className="text-[20px] font-semibold tabular-nums">
              {index + 1}/{total}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-syarah-green px-4 py-2.5 text-[14px] text-white">
          <span>غسيل مجاني ٣ اشهر</span>
          <a href="https://syarah.com/" className="underline underline-offset-2 transition-opacity hover:opacity-80">
            اعرف اكثر
          </a>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`صورة ${i + 1}`}
            className={`h-[58px] w-[86px] shrink-0 overflow-hidden rounded-[6px] border-2 transition ${
              i === index ? "border-syarah-green" : "border-transparent opacity-70"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" onClick={() => setZoom(false)} aria-label="رجوع">
              <img src={assets.whiteArrowBack} alt="" className="h-6 w-6" />
            </button>
            <span className="flex items-center gap-2 text-[14px] text-white">
              <img src={assets.imagesWhite} alt="" className="h-[18px] w-[18px]" />
              {index + 1}/{total}
            </span>
            <button type="button" onClick={() => setZoom(false)} aria-label="إغلاق">
              <img src={assets.closeSlider} alt="" className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
            <img src={images[index]} alt={title} className="max-h-full max-w-full object-contain" />
            <button
              type="button"
              aria-label="السابق"
              onClick={prev}
              className="absolute right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-syarah-text transition hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              type="button"
              aria-label="التالي"
              onClick={next}
              className="absolute left-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-syarah-text transition hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`صورة ${i + 1}`}
                className={`h-[56px] w-[84px] shrink-0 overflow-hidden rounded-[6px] border-2 transition ${
                  i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
