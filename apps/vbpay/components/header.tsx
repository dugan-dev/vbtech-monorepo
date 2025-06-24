"use client";

import { startTransition } from "react";
import { useParams, usePathname } from "next/navigation";
import { updateUserSelectionSlugAction } from "@/actions/update-user-selection-slug-action";
import { getPageTitle } from "@/utils/get-page-title";
import { APP_NAME } from "@/values/app-name";
import { signOut } from "aws-amplify/auth";
import { useAction } from "next-safe-action/hooks";
import { parseAsString, useQueryState } from "nuqs";

import { AppHeader } from "@workspace/ui/components/common/app-header";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { clearSidebarState } from "@workspace/ui/components/main-sidebar/main-sidebar-cookies";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { BreadcrumbItemType } from "@workspace/ui/types/breadcrumb-item";
import { UserSelectionData } from "@workspace/ui/types/user-selection-data";

import { Icons } from "@/components/icons";

type Props = {
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
  userSelectionData?: UserSelectionData;
};

export function Header({
  breadcrumbs,
  overrideTitle,
  userSelectionData,
}: Props) {
  const pathname = usePathname();
  const params = useParams();
  const [pId, setPId] = useQueryState(
    "pId",
    parseAsString
      .withDefault("")
      .withOptions({ startTransition, shallow: false }),
  );
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { execute } = useAction(updateUserSelectionSlugAction, {
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
  });

  return (
    <>
      {isErrorDialogOpen && (
        <ErrorDialog
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
          description={errorMsg}
          title={errorTitle}
        />
      )}
      <AppHeader
        breadcrumbs={breadcrumbs}
        overrideTitle={overrideTitle}
        userSelectionData={userSelectionData}
        getPageTitle={getPageTitle}
        signOut={signOut}
        onSignOut={() => clearSidebarState(APP_NAME)}
        pathname={pathname}
        slug={params.slug as string | undefined}
        userSelectionInstructText="Select Payer..."
        userSelectionNotFoundText="Payer Not Found"
        userSelectionSearchText="Search..."
        userSelectionUpdate={execute}
        userSelectionValue={pId ?? ""}
        onUserSelectionValueChange={setPId}
        userSelectionIcons={{
          chevronsUpDown: (
            <Icons.chevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          ),
          check: <Icons.check className="size-4" />,
          lock: <Icons.lock className="size-5" />,
          unlock: <Icons.unlock className="size-5" />,
        }}
      />
    </>
  );
}
