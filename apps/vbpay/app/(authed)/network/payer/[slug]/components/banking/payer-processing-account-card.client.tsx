"use client";

import { usePathname } from "next/navigation";
import { Landmark, Loader2, PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { openProcessingAccountForm } from "payload-react";
import { toast } from "sonner";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { PayloadProcessingAccount } from "@/types/payload-api-response-types";
import { PayloadProcessingAccountCreatedResponse } from "@/types/payload-processing-account-created-response";
import {
  PayloadProcessingAccountStatusLabels,
  PayloadProcessingAccountStatusType,
} from "@/types/payload-processing-account-status";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { insertPayerProcessingAccountAction } from "../../actions/insert-payer-processing-account-action";
import { getProcessingAccountStatusColor } from "../../utils/get-processing-account-status-color";
import { PayerProcessingAccountDetailsDialog } from "./payer-processing-account-detail-dialog";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];
const REQUIRED_USER_ROLES: UserRole[] = ["edit"];

type props = {
  payloadClientToken: string;
  payerPubId: string;
  processingAccounts: PayloadProcessingAccount[];
};

/**
 * Displays a card listing payer processing (bank) accounts with the ability for authorized users to add new accounts.
 *
 * Shows existing processing accounts in a table, provides an add button for users with appropriate permissions, and displays feedback for success or error states during account creation.
 *
 * @param payloadClientToken - Token used to open the processing account form.
 * @param payerPubId - Public ID of the payer to associate new processing accounts.
 * @param processingAccounts - List of processing accounts to display.
 *
 * @returns A React element rendering the processing accounts card with actions and details.
 */

export function PayerProcessingAccountCardClient({
  payloadClientToken,
  payerPubId,
  processingAccounts,
}: props) {
  // set up error dialog
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  // get the path to revalidate after a successful update
  const revalidationPath = usePathname();

  // set up action
  const { execute, isPending } = useAction(insertPayerProcessingAccountAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The payer has been updated successfully.",
      });
    },
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? `Invalid inputs. Please double check the data and try again. If the problem persists please contact support. ${JSON.stringify(error)}`
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
  });

  // open processing account form
  const handleNewProcessingAccountClick = () => {
    openProcessingAccountForm({
      clientToken: payloadClientToken,
      onAccountCreated: (data: PayloadProcessingAccountCreatedResponse) => {
        handleStoreProcessingAccount(data);
      },
    });
  };

  // store processing account in database onSuccess and revalidate
  const handleStoreProcessingAccount = (
    data: PayloadProcessingAccountCreatedResponse,
  ) => {
    execute({
      payerPubId,
      pubId: data.account.id,
      revalidationPath,
    });
  };

  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <ErrorDialog
        open={isErrorDialogOpen}
        title={errorTitle}
        description={errorMsg}
        onOpenChange={closeErrorDialog}
      />
      <CardHeader>
        <div className="flex items-center gap-2">
          <Landmark className="size-6" />
          <CardTitle className="text-2xl">Bank Accounts</CardTitle>
          <div className="relative ml-auto">
            <RestrictByUserAppAttrsClient
              allowedUserTypes={ALLOWED_USER_TYPES}
              requiredUserRoles={REQUIRED_USER_ROLES}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNewProcessingAccountClick}
                    disabled={isPending}
                  >
                    <PlusCircle className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New Bank Account</p>
                </TooltipContent>
              </Tooltip>
            </RestrictByUserAppAttrsClient>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          {isPending ? (
            <div className="flex justify-center gap-2">
              <Loader2 className="size-6 animate-spin" />
              Syncing Bank Account Data...
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              {processingAccounts.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No Bank Accounts Found
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Name</TableHead>
                      <TableHead className="w-1/3">Status</TableHead>
                      <TableHead className="text-end w-1/3">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processingAccounts.map((processingAccount) => (
                      <TableRow key={processingAccount.id}>
                        <TableCell>{processingAccount.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={getProcessingAccountStatusColor(
                              processingAccount.status as PayloadProcessingAccountStatusType,
                            )}
                            variant="outline"
                          >
                            {
                              PayloadProcessingAccountStatusLabels[
                                processingAccount.status as PayloadProcessingAccountStatusType
                              ]
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="text-end">
                          <PayerProcessingAccountDetailsDialog
                            account={processingAccount}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
