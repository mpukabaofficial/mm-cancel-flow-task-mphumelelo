import React from "react";
import Image from "next/image";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";

const CancelCompleteHelp = () => {
  return (
    <div className="w-full space-y-5">
      <h1 className="text-large">
        Your cancellation’s all sorted, mate, no more charges.
      </h1>
      <div className="p-4 space-y-2 bg-gray-warm-200 rounded-lg">
        <div className="flex gap-3">
          <div className="size-12 relative rounded-full overflow-hidden">
            <Image src="/mihailo-profile.jpeg" alt={""} fill />
          </div>
          <div>
            <div className="space-y-1text-sm tracking-[-0.28px]">
              <p>Mihailo Bozic</p>
              <p className="font-normal">&lt;mihailo@migratemate.co&gt;</p>
            </div>
          </div>
        </div>
        <div className="pl-15 space-y-5">
          <p>I’ll be reaching out soon to help with the visa side of things.</p>
          <p className="font-normal">
            We’ve got your back, whether it’s questions, paperwork, or just
            figuring out your options.
          </p>
          <p className="font-medium">
            Keep an eye on your inbox, I’ll be in touch shortly.
          </p>
        </div>
      </div>
      <HorizontalLine />
      <Button variant="primary">Finish</Button>
    </div>
  );
};

export default CancelCompleteHelp;
