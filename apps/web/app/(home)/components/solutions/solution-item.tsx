import { LucideIcon } from "lucide-react";

type props = {
  id: string;
  icon: LucideIcon | null;
  title: string;
  description: string;
};

export function SolutionItem({ icon: Icon, title, description, id }: props) {
  return (
    <div id={id} className="flex items-start space-x-4">
      {Icon && (
        <Icon
          className="h-10 w-10 text-primary flex-shrink-0 mt-1"
          aria-hidden="true"
        />
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
