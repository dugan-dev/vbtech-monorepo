import { BreadcrumbItemType } from "@/types/breadcrumb-item";
import { UserSelectionData } from "@/types/user-selection-data";
import { Header } from "@/components/header";

type props = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
  userSelectionData?: UserSelectionData;
};

/**
 * Renders a standard page layout with a header and main content area.
 *
 * Displays a header with optional breadcrumbs, title override, and user selection data, followed by the provided children within a styled main container.
 *
 * @param children - The content to display within the main area of the layout.
 * @param breadcrumbs - Optional breadcrumb navigation items for the header.
 * @param overrideTitle - Optional string to override the default header title.
 * @param userSelectionData - Optional user selection data to be passed to the header.
 */
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
