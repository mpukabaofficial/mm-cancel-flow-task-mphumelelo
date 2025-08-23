import { Skeleton, SkeletonText, SkeletonButton } from "./ui/Skeleton";
import { Step } from "@/types/step";

interface Props {}

const QuestionnaireSkeleton = ({}: Props) => {
  return (
    <div className="w-full space-y-5">
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <SkeletonText lines={2} />
        </div>

        {/* Questions skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-5/6" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-4/5 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal line */}
        <div className="border-t border-gray-200" />

        {/* Button skeleton */}
        <SkeletonButton />
    </div>
  );
};

export default QuestionnaireSkeleton;