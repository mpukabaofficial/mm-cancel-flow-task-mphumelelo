import { useRouter } from "next/navigation";

export const useNavigateApp = () => {
  const router = useRouter();

  const handleGoHome = (onClose?: () => void) => {
    try {
      // Close modal first for immediate UI feedback if provided
      if (onClose) {
        onClose();
      }
      // Navigate to home page
      router.replace("/");
    } catch (error) {
      console.error("Navigation error:", error);
      // Still close modal even if navigation fails
      if (onClose) {
        onClose();
      }
    }
  };

  return {
    handleGoHome,
  };
};