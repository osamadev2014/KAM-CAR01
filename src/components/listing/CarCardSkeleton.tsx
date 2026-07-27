export function CarCardSkeleton() {
  return (
    <article className="w-[283px] shrink-0 overflow-hidden rounded-[8px] border border-syarah-border bg-white">
      <div className="h-[190px] w-full animate-pulse bg-[#f3f3f3]" />
      <div className="px-3 pt-2.5">
        <div className="h-[18px] w-3/4 animate-pulse rounded bg-syarah-border" />
      </div>
      <div className="mx-3 mt-2.5 flex rounded-[6px] border border-syarah-border">
        <div className="flex-1 px-3 py-2">
          <div className="h-[12px] w-16 animate-pulse rounded bg-syarah-border" />
          <div className="mt-1.5 h-[20px] w-20 animate-pulse rounded bg-syarah-border" />
        </div>
        <div className="w-px bg-syarah-border" />
        <div className="flex-1 px-3 py-2">
          <div className="h-[12px] w-14 animate-pulse rounded bg-syarah-border" />
          <div className="mt-1.5 h-[20px] w-16 animate-pulse rounded bg-syarah-border" />
        </div>
      </div>
      <div className="mt-2.5 px-3 pb-2.5">
        <div className="h-[22px] w-14 animate-pulse rounded bg-syarah-border" />
      </div>
    </article>
  );
}
