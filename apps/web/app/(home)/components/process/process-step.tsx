import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

type props = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  isLastStep?: boolean;
};

export function ProcessStep({
  title,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
  isLastStep = false,
}: props) {
  return (
    <Card
      className="relative bg-white shadow-lg rounded-lg w-full md:w-1/4 flex flex-col items-center 
        transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 p-2"
      role="listitem"
    >
      <CardHeader>
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full ${iconBgColor}`}
        >
          <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-[.900rem] text-center">
          {description}
        </p>
        {!isLastStep && (
          <div
            className="hidden md:block absolute top-1/2 -right-10 w-10 h-[2px] bg-gray-300"
            aria-hidden="true"
          />
        )}
      </CardContent>
    </Card>
  );
}
