import React from "react";
import { Skeleton, SkeletonButton, SkeletonText } from "../ui/Skeleton";

const CancelOfferSkeleton = () => {
  return (
    <div className="w-full space-y-5">
      <div className="space-y-3">
        <Skeleton className="h-8 w-4/5" />
        <SkeletonText lines={1} />
      </div>
      <div className="p-3 border border-gray-200 bg-gray-50 rounded-xl space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <div className="flex gap-[10px] items-end justify-center w-full">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <SkeletonButton className="bg-green-100" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
      <div className="border-t border-gray-200" />
      <SkeletonButton />
    </div>
  );
};

export default CancelOfferSkeleton;
