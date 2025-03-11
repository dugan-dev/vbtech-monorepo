import { BreadcrumbItemType } from "@/types/breadcrumb-item";
import { PayerSelectionData } from "@/types/payer-selection-data";
import { Header } from "@/components/header";

type props = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
  payerSelectionData?: PayerSelectionData;
};

export function StandardLayout({
  children,
  breadcrumbs,
  overrideTitle,
  payerSelectionData,
}: props) {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-1 flex-col">
        <Header
          breadcrumbs={breadcrumbs}
          overrideTitle={overrideTitle}
          payerSelectionData={payerSelectionData}
        />
        <main className="container mx-auto flex flex-1 flex-col overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
