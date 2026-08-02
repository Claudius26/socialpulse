// Shimmer skeletons for customer pages — shown on a cold load so the page's
// shape appears immediately instead of a "Loading…" line.
export function SkeletonBox({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container-app py-6 md:py-10 space-y-6">
      <SkeletonBox className="h-32 w-full" />           {/* wallet / welcome */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonBox key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonBox key={i} className="h-28" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => <SkeletonBox key={i} className="h-56" />)}
      </div>
    </div>
  );
}

// Neutral full-page skeleton for the auth guard + lazy-route fallback, so a
// refresh shows shimmer (never a "Loading…" line) before the page mounts.
export function PageSkeleton() {
  return (
    <div className="container-app py-8 space-y-5">
      <SkeletonBox className="h-8 w-48" />
      <SkeletonBox className="h-28 w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonBox key={i} className="h-24" />)}
      </div>
      <SkeletonBox className="h-56 w-full" />
    </div>
  );
}

// Grid of card placeholders for catalog pages (eSIM plans, rental durations).
export function CardGridSkeleton({ cards = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonBox key={i} className="h-40" />
      ))}
    </div>
  );
}

// Generic table/list skeleton for history pages.
export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-2 py-4">
      <SkeletonBox className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox key={i} className="h-14 w-full !rounded-lg" />
      ))}
    </div>
  );
}
