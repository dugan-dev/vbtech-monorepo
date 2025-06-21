import { AlertCircle } from "lucide-react";

type props = {
  title?: string;
  description?: string;
};

export function MissingInvalidView({
  title = "Page not found",
  description = "Sorry, we couldn't find the page you're looking for.",
}: props) {
  return (
    <div className="flex min-h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
