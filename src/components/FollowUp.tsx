import { ReactNode } from "react";

const FollowUp = ({
  children,
  question,
}: {
  question: string;
  children: ReactNode;
}) => (
  <>
    <p className="text-normal">{question}*</p>
    {children}
  </>
);

export default FollowUp;
