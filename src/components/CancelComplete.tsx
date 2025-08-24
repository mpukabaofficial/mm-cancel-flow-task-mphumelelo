import useCancelSubscription from "@/hooks/CancelComplete/useCancelSubscription";
import { useNavigateApp } from "@/hooks/useNavigateApp";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";

interface Props {
  onClose: () => void;
  setNavigatingHome?: (value: boolean) => void;
}

const CancelComplete = ({ onClose, setNavigatingHome }: Props) => {
  const expirationDate = useCancelSubscription();
  // Calculate when subscription expires (next billing date)

  const { handleGoHome } = useNavigateApp();

  return (
    <div className="w-full space-y-5">
      <div className="space-y-2">
        <div>
          <p className="text-large mb-5">Sorry to see you go, mate.</p>
          <p className="text-3xl tracking-[-0.9px]">
            Thanks for being with us, and you’re always welcome back.
          </p>
        </div>
        <div>
          <p className="tracking-[-0.8px] mb-4">
            Your subscription is set to end on {expirationDate}. <br />
            You&apos;ll still have full access until then. No further charges
            after that.
          </p>
          <p className="text-normal tracking-[-0.8px]">
            Changed your mind? You can reactivate anytime before your end date.
          </p>
        </div>
      </div>
      <HorizontalLine />
      <Button
        onClick={() => handleGoHome(onClose, setNavigatingHome)}
        variant="primary"
      >
        Back to Jobs
      </Button>
    </div>
  );
};

export default CancelComplete;
