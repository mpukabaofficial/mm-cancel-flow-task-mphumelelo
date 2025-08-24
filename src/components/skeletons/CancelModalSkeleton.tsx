import { Skeleton, SkeletonText, SkeletonButton } from "../ui/Skeleton";

interface CancelModalSkeletonProps {
  variant?: "loading" | "questionnaire" | "form" | "completion";
  showStepIndicator?: boolean;
  showBackButton?: boolean;
  isContentOnly?: boolean;
}

const CancelModalSkeleton = ({
  variant = "loading",
  showStepIndicator = true,
  showBackButton = false,
  isContentOnly = false,
}: CancelModalSkeletonProps) => {
  // Skeleton content based on variant
  const renderSkeletonContent = () => (
    <div className="w-full space-y-5">
      {variant === "loading" && (
        <>
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <SkeletonText lines={2} />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="border-t border-gray-200" />
          <div className="space-y-3">
            <SkeletonButton className="bg-green-100" />
            <SkeletonButton className="bg-red-100" />
          </div>
        </>
      )}

      {variant === "questionnaire" && (
        <>
          <div className="space-y-3">
            <Skeleton className="h-8 w-4/5" />
            <SkeletonText lines={1} />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-5/6" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-4/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200" />
          <SkeletonButton />
        </>
      )}

      {variant === "form" && (
        <>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <SkeletonText lines={2} />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
          <div className="border-t border-gray-200" />
          <div className="space-y-3">
            <SkeletonButton className="bg-green-100" />
            <SkeletonButton className="bg-red-100" />
          </div>
        </>
      )}

      {variant === "completion" && (
        <>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/5" />
            <Skeleton className="h-7 w-4/5" />
          </div>
          <div className="space-y-2">
            <SkeletonText lines={3} />
          </div>
          <div className="border-t border-gray-200" />
          <SkeletonButton className="bg-blue-100" />
        </>
      )}
    </div>
  );

  // If content-only mode, just return the skeleton content
  if (isContentOnly) {
    return renderSkeletonContent();
  }

  // Full modal skeleton with card wrapper
  return (
    <div className="w-full sm:max-w-[1000px] h-[90vh] sm:max-h-[90vh] overflow-y-auto 
                   fixed bottom-0 left-0 sm:relative sm:bottom-auto sm:left-auto
                   rounded-t-[20px] sm:rounded-[20px] bg-white font-semibold text-gray-warm-800 
                   animate-slide-up sm:animate-none">
      {/* Mobile drag handle - only visible on small screens */}
      <div className="sm:hidden w-full flex justify-center pt-3 pb-2">
        <div className="w-8 h-1 bg-gray-warm-300 rounded-full"></div>
      </div>
      {/* Close button skeleton */}
      <div className="absolute top-[12px] right-[12px] sm:top-[18px] sm:right-[20px] z-10">
        <Skeleton className="size-6 rounded-full" />
      </div>

      {/* Back button skeleton */}
      {showBackButton && (
        <div className="absolute top-[12px] flex left-[12px] sm:top-[18px] sm:left-[20px] z-10 items-center gap-2">
          <Skeleton className="size-6 rounded" />
          <Skeleton className="h-4 w-10" />
        </div>
      )}

      {/* Header skeleton */}
      <div className="h-[50px] sm:h-[60px] flex justify-center items-center gap-4 border-gray-warm-300 border-b px-2">
        <Skeleton className="h-4 w-40" />
        {showStepIndicator && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <Skeleton className="h-2 w-6 rounded-full" />
              <Skeleton className="h-2 w-6 rounded-full" />
              <Skeleton className="h-2 w-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        )}
      </div>

      {/* Main content skeleton */}
      <div className="p-3 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-5">
        {/* Image skeleton */}
        <div className="order-1 md:order-2 h-[100px] sm:h-[122px] md:h-auto w-full md:w-[400px] relative flex-shrink-0 self-stretch">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        {/* Content skeleton - varies by variant */}
        {renderSkeletonContent()}
      </div>
    </div>
  );
};

export default CancelModalSkeleton;
