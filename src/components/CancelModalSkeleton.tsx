import { Skeleton, SkeletonText, SkeletonButton } from "./ui/Skeleton";

const CancelModalSkeleton = () => {
  return (
    <div className="w-full max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-[12px] sm:rounded-[20px] bg-white relative font-semibold text-gray-warm-800">
      {/* Close button skeleton */}
      <div className="absolute top-[12px] right-[12px] sm:top-[18px] sm:right-[20px] z-10">
        <Skeleton className="size-6 rounded-full" />
      </div>

      {/* Header skeleton */}
      <div className="h-[50px] sm:h-[60px] flex justify-center items-center gap-4 border-gray-warm-300 border-b px-2">
        <Skeleton className="h-4 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-2 w-6 rounded-full" />
          <Skeleton className="h-2 w-6 rounded-full" />
          <Skeleton className="h-2 w-6 rounded-full" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-3 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-5">
        {/* Image skeleton */}
        <div className="order-1 md:order-2 h-[100px] sm:h-[122px] md:h-auto w-full md:w-[400px] relative flex-shrink-0 self-stretch">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        {/* Content skeleton */}
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <SkeletonText lines={2} />
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          {/* Horizontal line */}
          <div className="border-t border-gray-200" />

          {/* Button skeletons */}
          <div className="space-y-4">
            <SkeletonButton className="bg-green-100" />
            <SkeletonButton className="bg-red-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModalSkeleton;