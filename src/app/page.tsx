// app/components/CancelModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import HorizontalLine from "@/components/ui/HorizontalLine";

export default function CancelModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="bg-black/30 absolute inset-0 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-[12px] sm:rounded-[20px] bg-white relative font-semibold text-gray-warm-800">
        <button className="absolute top-[12px] right-[12px] sm:top-[18px] sm:right-[20px] z-10">
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
        <div className="h-[50px] sm:h-[60px] flex justify-center items-center border-gray-warm-300 border-b px-2">
          <p className="text-xs sm:text-sm">Subscription Cancellation</p>
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
            />
          </div>
          {/* Content */}
          <div className="order-2 md:order-1 space-y-5 w-full">
            <div className="font-semibold space-y-4">
              <p className="text-large md:text-large text-2xl flex flex-col">
                <span>Hey mate,</span>
                <span>Quick one before you go.</span>
              </p>
              <p className="text-large md:text-large text-2xl italic">
                Have you found a job yet?
              </p>
            </div>
            <p className="text-gray-warm-700 text-base tracking-tighter w-full md:w-[469px]">
              Whatever your answer, we just want to help you take the next step.
              With visa support, or by hearing how we can do better.
            </p>
            <HorizontalLine />

            <div className="w-full space-y-4">
              <Button>Yes, I've found a job</Button>
              <Button>Not yet - I'm still looking </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
