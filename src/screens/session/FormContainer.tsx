import { ReactNode } from "react";

interface FormContainerProps {
  form: ReactNode;
}

export const FormContainer = ({ form }: FormContainerProps) => {
  return <main className="px-4">{form}</main>;
};
