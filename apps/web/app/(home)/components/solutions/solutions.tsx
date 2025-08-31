import Image from "next/image";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

import { SolutionItem } from "./solution-item";
import { SOLUTIONS_CONTENT } from "./solutions-content";

export function Solutions() {
  return (
    <section
      id={SOLUTIONS_CONTENT.id}
      className="py-16 bg-gradient-to-br from-gray-50 scroll-mt-24"
      aria-labelledby="solutions-title"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold" id="solutions-title">
          {SOLUTIONS_CONTENT.title}
        </h2>
        <p className="mt-2 text-gray-600 max-w-4xl mx-auto">
          {SOLUTIONS_CONTENT.description}
        </p>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Column (VB Pay) */}
          <Card
            id={SOLUTIONS_CONTENT.vbPay.id}
            className="w-96 transition-all duration-150 ease-in-out hover:shadow-xl hover:scale-105 relative bg-primary/90 text-white border border-gray-200 md:min-w-96"
          >
            <CardHeader className="flex flex-col items-center text-center relative pt-14 pb-4">
              {/* Flagship Badge (Adjusted Position) */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="text-xs bg-white text-primary px-2 py-1"
                >
                  {SOLUTIONS_CONTENT.vbPay.flagshipBadge}
                </Badge>
              </div>

              {/* VB Pay Logo (Now White for Contrast) */}
              <Image
                src={SOLUTIONS_CONTENT.vbPay.logo} // Ensure a white version is used
                alt="VB Pay Logo"
                width={128}
                height={32}
                className="rounded-lg"
              />
            </CardHeader>

            <CardContent className="flex flex-col flex-grow">
              {/* Main Description (White Text for Visibility) */}
              <p className="text-white text-left pl-2 leading-relaxed">
                {SOLUTIONS_CONTENT.vbPay.description}
              </p>

              {/* Additional Tagline (Slightly Lighter for Hierarchy) */}
              <p className="mt-3 text-sm text-gray-300">
                {SOLUTIONS_CONTENT.vbPay.tagline}
              </p>
            </CardContent>
          </Card>

          {/* Right Column (Other Solutions) */}
          <div className="md:col-span-2 text-left space-y-6">
            {SOLUTIONS_CONTENT.otherSolutions.map((solution) => (
              <SolutionItem key={solution.title} {...solution} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
