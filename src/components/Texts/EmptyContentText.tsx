import React from "react";

interface EmptyContentTextProps {
  text: string;
}

export const EmptyContentText = ({ text }: EmptyContentTextProps) => {
  return <p className="text-lg text-muted-foreground">{text} 🤷</p>;
};
