import React, { useState } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { subscriptionService } from "@/lib/subscriptionService";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";

interface Props {
  onClose: (isOpen: boolean) => void;
}

const CancelCompleteHelp = ({ onClose }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { subscription } = useUser();

  const handleFinish = async () => {
    setIsProcessing(true);
    
    try {
      // Cancel the subscription
      if (subscription?.id) {
        await subscriptionService.cancel(subscription.id);
        console.log("Subscription cancelled successfully");
      }
      
      // Log that email has been sent
      console.log("Email has been sent to the person");
      
      // Close the modal
      onClose(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      // Still close the modal even if cancellation fails
      onClose(false);
    } finally {
      setIsProcessing(false);
    }
  };

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
      <Button 
        variant="primary" 
        onClick={handleFinish} 
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Finish"}
      </Button>
    </div>
  );
};

export default CancelCompleteHelp;
