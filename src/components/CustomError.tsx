import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CustomErrorProps {
  title?: string;
  message?: string;
  showFooter?: boolean;
  redirectText?: string;
  redirectTo?: string;
}

export const CustomError = ({
  title = "Oops! We had an error",
  message = "Sorry for the inconvenience.",
  showFooter = true,
  redirectText = "Go back to home",
  redirectTo = "/"
}: CustomErrorProps) => {
  message = message.endsWith(".") ? message : `${message}.`;

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent className="space-y-4 py-4 text-center">
        <img
          src="/images/error-image.svg"
          alt="Error image"
          width={382}
          height={238}
        />
        <h2 className="text-2xl font-bold">{title}</h2>
        <p>
          {message} Try again or report this error in the{" "}
          <a
            href="https://github.com/upb-code-labs/react-client/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-upb"
          >
            GitHub repository{" "}
            <ExternalLinkIcon className="inline-block" size={16} />.
          </a>
        </p>
      </CardContent>
      {showFooter && (
        <CardFooter>
          <Link
            to={redirectTo}
            className={buttonVariants({
              variant: "destructive",
              className: "w-full bg-red-upb",
              size: "lg"
            })}
          >
            {redirectText}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
