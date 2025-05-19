import { Icons } from "@/components/icons";

type props = {
  description?: string;
  title?: string;
};

export function MissingInvalidView({ description, title }: props) {
  return (
    <div className="p-6 text-center">
      <Icons.alertCircle className="mx-auto size-12 text-gray-400" />
      <h2 className="mt-2 text-lg font-medium text-gray-900">
        {title || "Missing, Invalid or Unauthorized parameter"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        {description ||
          "The parameter is missing, invalid or you are not authorized to access this content."}
      </p>
    </div>
  );
}
