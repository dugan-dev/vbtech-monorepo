import { BreadcrumbItemType } from "@/types/breadcrumb-item";
import { Header } from "@/components/header";

type props = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
};

export function StandardLayout({
  children,
  breadcrumbs,
  overrideTitle,
}: props) {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-1 flex-col">
        <Header breadcrumbs={breadcrumbs} overrideTitle={overrideTitle} />
        <main className="container mx-auto flex flex-1 flex-col overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
