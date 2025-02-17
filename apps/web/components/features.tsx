import {
  CircleDollarSign,
  Columns3,
  Download,
  LayoutPanelLeft,
  Sparkles,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@workspace/ui/components/card";

export function Features() {
  return (
    <section className="container flex flex-col items-center gap-6 py-24 sm:gap-7">
      <div className="flex flex-col gap-3">
        <span className="text-primary text-center font-bold uppercase">
          Features
        </span>
        <h2 className="font-heading text-center text-3xl font-semibold sm:text-4xl">
          Same-day Payment and Remittance
        </h2>
      </div>
      <p className="text-muted-foreground max-w-2xl text-center text-lg">
        Modern payment processing with customizable remittance generation and
        seamless same-day delivery.
      </p>
      <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-start gap-5 p-7">
            <div className="border-border bg-secondary inline-flex items-center justify-center rounded-md p-2">
              <CircleDollarSign size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Same-day ACH Payments
              </h4>
              <p className="text-muted-foreground">
                Utilize cutting-edge payment processing for same-day ACH
                transfers to any U.S. bank account—no bank integrations
                required.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-start gap-5 p-7">
            <div className="border-border bg-secondary inline-flex items-center justify-center rounded-md p-2">
              <Download size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Remittance Services
              </h4>
              <p className="text-muted-foreground">
                From PDFs to data files and 835 EDI formats, VB Pay delivers it
                all. We also manage clearinghouse connectivity for seamless
                processing.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-start gap-5 p-7">
            <div className="border-border bg-secondary inline-flex items-center justify-center rounded-md p-2">
              <Columns3 size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Payment Types
              </h4>
              <p className="text-muted-foreground">
                VB Pay supports a variety of payment types, including
                pre-adjudicated claim-based payments, capitation payments, and
                bonus payments.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-start gap-5 p-7">
            <div className="border-border bg-secondary inline-flex items-center justify-center rounded-md p-2">
              <Sparkles size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Modern, Purpose-Built Technology
              </h4>
              <p className="text-muted-foreground">
                Designed to seamlessly integrate with the files ACOs receive
                from CMS, eliminating the need for conversions or adapters.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-start gap-5 p-7">
            <div className="border-border bg-secondary inline-flex items-center justify-center rounded-md p-2">
              <LayoutPanelLeft size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Reporting Capabilities
              </h4>
              <p className="text-muted-foreground">
                Access comprehensive Alignment and Attribution dashboards with
                built-in reporting features, including the option to download
                detailed data behind the metrics.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-start gap-5 p-7">
            <div className="border-border bg-secondary inline-flex items-center justify-center rounded-md p-2">
              <Users size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Portal Personas
              </h4>
              <p className="text-muted-foreground">
                VB Tech customers and their physician partners can easily access
                VB Pay to view the Activity Schedule, download remittance data,
                and review detailed payment breakdown reports.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
