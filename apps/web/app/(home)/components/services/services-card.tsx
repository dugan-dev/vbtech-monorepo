import Link from "next/link";
import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

type props = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

export function ServiceCard({ icon: Icon, title, description, href }: props) {
  return (
    <Card className="transition-all duration-150 ease-in-out hover:shadow-xl hover:scale-105 flex flex-col h-full">
      <CardHeader className="flex flex-col items-center">
        <Icon className="h-12 w-12 text-primary mb-3" aria-hidden="true" />
        <CardTitle className="text-xl font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-gray-600 flex-grow">{description}</p>
        <div className="pt-6">
          <Link
            href={href}
            className="text-primary hover:underline hover:font-semibold inline-flex items-center"
            aria-label={`Learn more about ${title}`}
          >
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
