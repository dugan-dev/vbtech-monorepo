import { ReactElement, ReactNode } from "react";

/**
 * Props for the EmptyView component.
 */
type props = {
  /** Description text displayed below the title */
  description: string;
  /** Main title displayed prominently */
  title: string;
  /** Optional action text displayed at the bottom */
  actionText?: string;
  /** Icon element to display above the title */
  icon: ReactElement;
  /** Optional children to render between description and action text */
  children?: ReactNode;
};

/**
 * Displays an empty state with an icon, title, description, and optional action.
 *
 * This component is used to show users when there's no content to display,
 * such as empty lists, search results, or initial states. It provides a
 * consistent empty state design across the application.
 *
 * @param props - Configuration object containing display content and optional elements
 * @returns EmptyView component with centered layout and consistent styling
 */
export function EmptyView({
  description,
  title,
  actionText,
  icon,
  children,
}: props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {children}
      {actionText && <p className="text-sm text-gray-500 mt-4">{actionText}</p>}
    </div>
  );
}
