import { Loader2 } from "lucide-react";

type LoadingProps = {
  text?: string;
};

export default function LoadingSpinner(props: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        {props.text && (
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            {props.text}
          </p>
        )}
      </div>
    </div>
  );
}
