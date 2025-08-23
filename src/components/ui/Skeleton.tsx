interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ lines = 1, className = "" }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

export const SkeletonButton = ({ className = "" }: SkeletonProps) => (
  <Skeleton className={`h-12 w-full rounded-lg ${className}`} />
);

export const SkeletonCard = ({ className = "" }: SkeletonProps) => (
  <div className={`bg-white rounded-[12px] sm:rounded-[20px] border ${className}`}>
    <div className="p-3 sm:p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <SkeletonText lines={2} />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <SkeletonButton />
    </div>
  </div>
);