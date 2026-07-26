import { useState } from "react";
import { faqs } from "../../data/listing";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-syarah-section py-16">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-10 text-center text-[28px] font-bold text-syarah-blue">اسئلة متكررة</h2>
        <div className="mx-auto flex max-w-[760px] flex-col gap-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-[8px] border border-syarah-border bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-6 py-4 text-right transition-colors hover:bg-slate-50/70"
                >
                  <h3 className="text-[15px] font-bold text-syarah-blue">{f.q}</h3>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2c5fb5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[13px] leading-[2] text-syarah-muted">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="https://syarah.com/faq"
            className="rounded-[6px] border border-syarah-border bg-white px-10 py-3 text-[15px] font-semibold text-syarah-text transition-colors hover:border-syarah-blue hover:text-syarah-blue"
          >
            اعرض المزيد
            <span className="sr-only">المزيد من الاسئلة المتكررة</span>
          </a>
        </div>
      </div>
    </section>
  );
}
