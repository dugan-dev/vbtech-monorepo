import { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function BenefitCard({
  icon: Icon,
  title,
  description,
}: BenefitCardProps) {
  return (
    <div className="flex items-start space-x-4" role="listitem">
      <Icon className="h-8 w-8 text-primary shrink-0 mt-1" aria-hidden="true" />
      <div className="text-left space-y-2 pt-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
