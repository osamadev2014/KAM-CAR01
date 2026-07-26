import { useState } from "react";
import { assets } from "../../data/listing";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function SpecCard({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-[8px] border border-syarah-border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-right transition-colors hover:bg-slate-50/70"
      >
        <h3 className="text-[16px] font-bold text-syarah-text">{title}</h3>
        <img
          src={assets.roundArrow}
          alt=""
          className={`h-[18px] w-[18px] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-syarah-border">{children}</div>
        </div>
      </div>
    </section>
  );
}
