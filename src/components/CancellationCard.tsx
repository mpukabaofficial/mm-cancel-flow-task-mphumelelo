"use client";

import Image from "next/image";
import { ReactNode } from "react";
import StepIndicator from "./StepIndicator";
import { Step } from "@/types/step";

interface Props {
  onClose: () => void;
  step: Step;
  children: ReactNode;
  onSetStep: (step: Step) => void;
  totalSteps: number;
}

const CancellationCard = ({
  onClose,
  step = {
    num: 0,
    option: "A",
  },
  children,
  onSetStep,
  totalSteps,
}: Props) => {
  return (
    <div className="w-full max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-[12px] sm:rounded-[20px] bg-white relative font-semibold text-gray-warm-800">
      <button
        onClick={onClose}
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

      {step.num > 0 && (
        <button
          onClick={() => onSetStep({ ...step, num: step.num - 1 })}
          className="absolute top-[12px] flex left-[12px] sm:top-[18px] sm:left-[20px] z-10"
        >
          <div className="size-6 flex justify-center items-center">
            <svg
              width="9"
              height="14"
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.95711 13.2071C7.56658 13.5976 6.93342 13.5976 6.54289 13.2071L1.04289 7.70711C0.65237 7.31658 0.65237 6.68342 1.04289 6.29289L6.54289 0.792894C6.93342 0.402369 7.56658 0.402369 7.95711 0.792894C8.34763 1.18342 8.34763 1.81658 7.95711 2.20711L3.16421 7L7.95711 11.7929C8.34763 12.1834 8.34763 12.8166 7.95711 13.2071Z"
                fill="#62605C"
              />
            </svg>
          </div>
          <span className="text-gray-warm-700">Back</span>
        </button>
      )}
      <div className="h-[50px] sm:h-[60px] flex justify-center items-center gap-4 border-gray-warm-300 border-b px-2">
        <p className="text-xs sm:text-sm">Subscription Cancellation</p>
        {step.num > 0 && (
          <div>
            <StepIndicator currentStep={step.num} totalSteps={totalSteps} />
          </div>
        )}
      </div>
      {/* main */}
      <div className="p-3 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-5">
        {/* Image on top for mobile, right side for desktop */}
        <div className="order-1 md:order-2 h-[100px] sm:h-[122px] md:h-auto w-full md:w-[400px] relative flex-shrink-0 self-stretch">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York skyline"
            className="rounded-lg object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        </div>
        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default CancellationCard;
