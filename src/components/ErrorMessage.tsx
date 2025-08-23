import React from "react";

const ErrorMessage = ({ error }: { error: string | null }) => {
  return <>{error && <p className="text-red-500 text-normal">{error}</p>}</>;
};

export default ErrorMessage;
