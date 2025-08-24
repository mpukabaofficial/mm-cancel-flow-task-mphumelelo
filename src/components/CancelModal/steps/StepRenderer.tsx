import { Step } from "@/types/step";
import { DownsellVariant } from "@/lib/variant";
import { Subscription } from "@/contexts/UserContext";
import AcceptedDownsell from "../../AcceptedDownsell";
import CancelComplete from "../../CancelComplete";
import CancelCompleteHelp from "../../CancelCompleteHelp";
import CancelHow from "../../CancelHow";
import CancelOffer from "../../CancelOffer";
import CancelReasonStep from "../../CancelReasonStep";
import CancelReasons from "../../CancelReasons";
import CancellationVisa from "../../CancellationVisa";
import CancellationVisaNoJob from "../../CancellationVisaNoJob";
import FoundJobQuestionnaire from "../../FoundJobQuestionnaire";
import JobCancelComplete from "../../JobCancelComplete";
import NoJobQuestionnaire from "../../NoJobQuestionnaire";

interface StepRendererProps {
  currentStep: Step;
  variant: DownsellVariant;
  subscription: Subscription | null;
  navigateToStep: (step: Step) => void;
  navigateBack: () => void;
  resetNavigation: (step?: Step) => void;
  handleClose: () => void;
  isNavigatingHome: React.MutableRefObject<boolean>;
}

export class StepRenderer {
  static renderInitialStep(props: StepRendererProps) {
    const { navigateToStep, resetNavigation } = props;
    return (
      <CancelReasonStep
        setStep={navigateToStep}
        resetNavigation={resetNavigation}
      />
    );
  }

  static renderStep1(props: StepRendererProps) {
    const { currentStep, variant, subscription, navigateToStep } = props;

    if (currentStep.option === "job-found") {
      return (
        <FoundJobQuestionnaire step={currentStep} setStep={navigateToStep} />
      );
    }

    // Variant B: Show downsell offer
    if (variant === "B") {
      return (
        <CancelOffer
          step={currentStep}
          setStep={navigateToStep}
          variant={variant}
        />
      );
    }

    // Variant A: Direct to questionnaire
    return (
      <NoJobQuestionnaire
        step={currentStep}
        onSetStep={navigateToStep}
        variant={variant}
        subscriptionAmount={subscription?.monthly_price || 25}
      />
    );
  }

  static renderStep2(props: StepRendererProps) {
    const {
      currentStep,
      variant,
      subscription,
      navigateToStep,
      handleClose,
      isNavigatingHome,
    } = props;

    // Job flow: How did we help
    if (currentStep.option === "withMM" || currentStep.option === "withoutMM") {
      return <CancelHow step={currentStep} setStep={navigateToStep} />;
    }

    // Downsell accepted
    if (currentStep.option === "A") {
      return (
        <AcceptedDownsell
          onClose={handleClose}
          subscription={subscription}
          setNavigatingHome={(value: boolean) => {
            isNavigatingHome.current = value;
          }}
        />
      );
    }

    // Variant-based flow
    if (variant === "A") {
      return (
        <CancelReasons
          setStep={navigateToStep}
          variant={variant}
          subscriptionAmount={subscription?.monthly_price || 25}
        />
      );
    }

    // Variant B fallback
    return (
      <NoJobQuestionnaire
        step={currentStep}
        onSetStep={navigateToStep}
        variant={variant}
        subscriptionAmount={subscription?.monthly_price || 25}
      />
    );
  }

  static renderStep3(props: StepRendererProps) {
    const {
      currentStep,
      variant,
      subscription,
      navigateToStep,
      handleClose,
      isNavigatingHome,
    } = props;

    if (currentStep.option === "cancel-complete") {
      return (
        <CancelComplete
          onClose={handleClose}
          setNavigatingHome={(value: boolean) => {
            isNavigatingHome.current = value;
          }}
        />
      );
    }

    if (currentStep.option === "withMM") {
      return <CancellationVisa onSetStep={navigateToStep} step={currentStep} />;
    }

    if (currentStep.option === "withoutMM") {
      return (
        <CancellationVisaNoJob onSetStep={navigateToStep} step={currentStep} />
      );
    }

    // Default: CancelReasons
    return (
      <CancelReasons
        setStep={navigateToStep}
        variant={variant}
        subscriptionAmount={subscription?.monthly_price || 25}
      />
    );
  }

  static renderVisaHelpComplete() {
    return <CancelCompleteHelp />;
  }

  static renderStep4(props: StepRendererProps) {
    const { currentStep, handleClose, isNavigatingHome } = props;

    if (currentStep.option === "job-cancel-complete") {
      return <JobCancelComplete onClose={handleClose} />;
    }

    if (currentStep.option === "get-visa-help") {
      return this.renderVisaHelpComplete();
    }

    // Default: CancelComplete
    return (
      <CancelComplete
        onClose={handleClose}
        setNavigatingHome={(value: boolean) => {
          isNavigatingHome.current = value;
        }}
      />
    );
  }

  static renderStep(stepNumber: number, props: StepRendererProps) {
    switch (stepNumber) {
      case 0:
        return this.renderInitialStep(props);
      case 1:
        return this.renderStep1(props);
      case 2:
        return this.renderStep2(props);
      case 3:
        return this.renderStep3(props);
      case 4:
        return this.renderStep4(props);
      default:
        return (
          <CancelComplete
            onClose={props.handleClose}
            setNavigatingHome={(value: boolean) => {
              props.isNavigatingHome.current = value;
            }}
          />
        );
    }
  }
}
