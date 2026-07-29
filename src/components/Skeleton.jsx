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
