interface EmptyContentTextProps {
  text: string;
  className?: string;
}

export const EmptyContentText = ({
  text,
  className
}: EmptyContentTextProps) => {
  return (
    <p className={`text-lg text-muted-foreground ${className}`}>{text} 🤷</p>
  );
};
