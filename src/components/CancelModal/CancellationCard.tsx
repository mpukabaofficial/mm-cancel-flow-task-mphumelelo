"use client";

import { Step } from "@/types/step";
import Image from "next/image";
import { ReactNode, useRef, useState } from "react";
import CancelModalSkeleton from "../skeletons/CancelModalSkeleton";
import StepIndicator from "../StepIndicator";
import ChevronLeft from "../ui/icons/ChevronLeft";

interface Props {
  onClose: () => void;
  step: Step;
  children: ReactNode;
  onSetStep?: (step: Step) => void;
  totalSteps: number;
  hideNavigation?: boolean;
  completed?: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
  isLoading?: boolean;
  skeletonVariant?: "loading" | "questionnaire" | "form" | "completion";
}

const CancellationCard = ({
  onClose,
  step = {
    num: 0,
    option: "A",
  },
  children,
  totalSteps,
  hideNavigation = false,
  completed = false,
  canGoBack = false,
  onBack,
  isLoading = false,
  skeletonVariant = "loading",
}: Props) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance to trigger close (in pixels)
  const minSwipeDistance = 50;

  const handleClose = () => {
    onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640) return; // Only on mobile
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640 || !isDragging || touchStart === null) return;

    const currentTouch = e.targetTouches[0].clientY;
    const diff = currentTouch - touchStart;

    // Only allow downward dragging
    if (diff > 0) {
      setDragOffset(diff);
      setTouchEnd(currentTouch);
    }
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 640 || !isDragging) return;

    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchEnd - touchStart;
    const isDownSwipe = distance > minSwipeDistance;

    if (isDownSwipe) {
      handleClose();
    } else {
      // Snap back to original position
      setDragOffset(0);
    }

    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const dragStyle =
    isDragging && dragOffset > 0
      ? { transform: `translateY(${Math.min(dragOffset, 200)}px)` }
      : {};

  return (
    <div
      ref={containerRef}
      className="w-full sm:max-w-[1000px] h-[90vh] sm:max-h-[90vh] sm:h-fit overflow-y-auto 
                 fixed bottom-0 left-0 sm:relative sm:bottom-auto sm:left-auto
                 rounded-t-[20px] sm:rounded-[20px] bg-white font-semibold text-gray-warm-800"
      style={dragStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile drag handle - only visible on small screens */}
      <div className="sm:hidden w-full flex justify-center pt-3 pb-2">
        <div className="w-8 h-1 bg-gray-warm-300 rounded-full"></div>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-[12px] right-[12px] sm:top-[18px] sm:right-[20px] z-10"
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.2432 18.1569C16.6337 18.5474 17.2669 18.5474 17.6574 18.1569C18.0479 17.7664 18.0479 17.1332 17.6574 16.7427L13.4148 12.5001L17.6574 8.25742C18.0479 7.8669 18.0479 7.23373 17.6574 6.84321C17.2669 6.45268 16.6337 6.45268 16.2432 6.84321L12.0005 11.0858L7.75789 6.84319C7.36736 6.45266 6.7342 6.45266 6.34368 6.84319C5.95315 7.23371 5.95315 7.86688 6.34368 8.2574L10.5863 12.5001L6.34367 16.7427C5.95315 17.1332 5.95315 17.7664 6.34367 18.1569C6.7342 18.5474 7.36736 18.5474 7.75789 18.1569L12.0005 13.9143L16.2432 18.1569Z"
            fill="#62605C"
          />
        </svg>
      </button>

      {!hideNavigation && canGoBack && onBack && (
        <button
          onClick={onBack}
          className="absolute top-[12px] flex left-[12px] sm:top-[18px] sm:left-[20px] z-10"
        >
          <ChevronLeft />
          <span className="text-gray-warm-700">Back</span>
        </button>
      )}
      <div className="h-[50px] sm:h-[60px] flex justify-center items-center gap-4 border-gray-warm-300 border-b px-2">
        <p className="text-xs sm:text-sm">Subscription Cancellation</p>
        {!hideNavigation && step.num > 0 && (
          <div>
            <StepIndicator
              currentStep={step.num}
              totalSteps={totalSteps}
              completed={completed}
            />
          </div>
        )}
      </div>
      {/* main */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-5">
        {/* Image on top for mobile, right side for desktop */}
        <div className="order-first md:order-2 h-[100px] sm:h-[122px] md:h-auto w-full md:w-[400px] relative flex-shrink-0 self-stretch">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York skyline"
            className="rounded-lg object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        </div>

        {/* Show skeleton content if loading, otherwise show children */}
        {isLoading ? (
          <div className="w-full animate-pulse order-last md:order-1">
            <CancelModalSkeleton
              variant={skeletonVariant}
              showStepIndicator={step.num > 0}
              showBackButton={canGoBack && step.num > 0}
              isContentOnly={true}
            />
          </div>
        ) : (
          <div className="w-full animate-fade-in order-last md:order-1">{children}</div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CancellationCard;
