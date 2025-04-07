import { BreadcrumbItemType } from "@/types/breadcrumb-item";
import { UserSelectionData } from "@/types/user-selection-data";
import { Header } from "@/components/header";

type props = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
  userSelectionData?: UserSelectionData;
};

export function StandardLayout({
  children,
  breadcrumbs,
  overrideTitle,
  userSelectionData,
}: props) {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-1 flex-col">
        <Header
          breadcrumbs={breadcrumbs}
          overrideTitle={overrideTitle}
          userSelectionData={userSelectionData}
        />
        <main className="container mx-auto flex flex-1 flex-col overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
