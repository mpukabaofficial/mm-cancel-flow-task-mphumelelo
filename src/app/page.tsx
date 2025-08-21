// app/components/CancelModal.tsx
"use client";

import { useState } from "react";

export default function CancelModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="bg-black/30 absolute inset-0">
      <div className="w-[1000px] rounded-lg mx-auto mt-20 bg-white relative">
        <button className="absolute top-[18px] right-[20px]">
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
        <div className="h-[60px] flex justify-center items-center">
          <div></div>
          <p className="text-grey-warm-800 font-semibold">
            Subscription Cancellation
          </p>
        </div>
        <div>
          <div>
            <div>
              <p className="text-4xl">
                <span>Hey mate,</span>
                <span>Quick one before you go.</span>
              </p>
              <p className="text-4xl"></p>
            </div>
            <div>subtext</div>
            <div>buttons</div>
          </div>
          <div>right</div>
        </div>
      </div>
    </div>
  );
}
