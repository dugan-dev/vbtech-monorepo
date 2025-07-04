"use client";

import { useParams, usePathname } from "next/navigation";
import { deletePayloadPaymentMethodAction } from "@/actions/delete-payload-payment-method-action";
import { useUserContext } from "@/contexts/user-context";
import { canUserEditPayer } from "@/utils/can-user-edit-payer";
import { Landmark, MoreVertical, PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { PaymentMethodForm } from "payload-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { InputDefaultClassname } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  SelectItemDefaultClassname,
  SelectTriggerDefaultClassname,
} from "@workspace/ui/components/select";
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
import { stringToTitleCase } from "@workspace/ui/lib/stringToTitleCase";

import { PayloadPaymentMethod } from "@/types/payload-payment-method";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

const ALLOWED_USER_TYPES: UserType[] = [
  "bpo",
  "payers",
  "payer",
  "vendor",
  "practice",
  "facility",
  "physician",
  "po",
];
const REQUIRED_USER_ROLE: UserRole = "edit";

type props = {
  payloadClientToken: string;
  paymentMethods: PayloadPaymentMethod[];
  payerPubId: string;
};

/**
 * Displays and manages bank account payment methods for a physical entity.
 *
 * Renders a card interface listing existing bank accounts and allows authorized users to add or delete accounts. Handles permission checks, form submissions, and provides user feedback through dialogs and toast notifications.
 *
 * @param payloadClientToken - Token used to authenticate Payload API requests.
 * @param paymentMethods - List of bank account payment methods to display.
 * @param payerPubId - Public identifier for the payer entity.
 *
 * @remark Only users with the required type and role can add or delete bank accounts. Unauthorized actions trigger an error dialog.
 */
export function PhysEntityPaymentMethodCardClient({
  payloadClientToken,
  paymentMethods,
  payerPubId,
}: props) {
  // set up error dialog
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const usersData = useUserContext();

  // get phys/entity pub id
  const { slug } = useParams();
  const physEntityPubId = slug as string;

  // set up action
  const { execute, isPending } = useAction(deletePayloadPaymentMethodAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The Bank Account has been deleted successfully.",
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

  // get revalidation path
  const revalidationPath = usePathname();

  const userCanEdit = canUserEditPayer({
    payerPubId,
    allowedUserTypes: ALLOWED_USER_TYPES,
    usersAppAttrs: usersData.usersAppAttrs,
  });

  /**
   * Deletes a payment method by its ID if the user has edit permissions.
   *
   * Opens an error dialog if the user lacks permission to perform the deletion.
   *
   * @param id - Unique identifier of the payment method to delete.
   */
  function handleDeletePaymentMethod(id: string) {
    if (!userCanEdit) {
      openErrorDialog(
        "Error",
        "User does not have permission to delete this payment method.",
      );
      return;
    }

    execute({ id, payerPubId, revalidationPath });
  }

  return (
    <Card className="min-w-[450px] w-1/3 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
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
              requiredUserRoles={[REQUIRED_USER_ROLE]}
            >
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PlusCircle className="size-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add New Bank Account</p>
                  </TooltipContent>
                </Tooltip>
                <DialogContent>
                  <DialogTitle>Add New Bank Account</DialogTitle>
                  <PaymentMethodForm
                    className="flex flex-col gap-2 size-full"
                    clientToken={payloadClientToken}
                    autoSubmit={false}
                    preventDefaultOnSubmit={false}
                    preventSubmitOnEnter={false}
                    paymentMethod={{
                      type: "bank_account",
                      transfer_type: "receive-only",
                      attrs: {
                        pubId: physEntityPubId,
                      },
                    }}
                    onError={(error: Error) => {
                      openErrorDialog("Error", error.message);
                    }}
                    onSuccess={() => {
                      toast("Success", {
                        description:
                          "The bank account has been added successfully.",
                      });
                    }}
                  >
                    <div className="grid gap-2">
                      <Label>
                        <div className="flex items-center">
                          Account Type
                          <span className="text-md ms-2 font-extrabold text-red-600">
                            *
                          </span>
                        </div>
                      </Label>
                      <select
                        pl-input="account_type"
                        className={SelectTriggerDefaultClassname}
                      >
                        <option
                          value="checking"
                          className={SelectItemDefaultClassname}
                        >
                          Checking
                        </option>
                        <option
                          value="savings"
                          className={SelectItemDefaultClassname}
                        >
                          Savings
                        </option>
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label>
                        <div className="flex items-center">
                          Account Number
                          <span className="text-md ms-2 font-extrabold text-red-600">
                            *
                          </span>
                        </div>
                      </Label>
                      <div
                        className={InputDefaultClassname}
                        pl-input="account_number"
                        // @ts-expect-error - placeholder is needed for this custom component
                        placeholder=""
                      />
                    </div>
                    <div className="grid gap-2 mb-4">
                      <Label>
                        <div className="flex items-center">
                          Routing Number
                          <span className="text-md ms-2 font-extrabold text-red-600">
                            *
                          </span>
                        </div>
                      </Label>
                      <div
                        className={InputDefaultClassname}
                        pl-input="routing_number"
                        // @ts-expect-error - placeholder is needed for this custom component
                        placeholder=""
                      />
                    </div>
                    <button
                      className={buttonVariants({ size: "lg" })}
                      type="submit"
                    >
                      Save
                    </button>
                  </PaymentMethodForm>
                </DialogContent>
              </Dialog>
            </RestrictByUserAppAttrsClient>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="space-y-1 text-sm">
            {paymentMethods.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No Bank Accounts Found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Bank</TableHead>
                    <TableHead className="w-1/4">Type</TableHead>
                    <TableHead className="w-1/4">Account #</TableHead>
                    <TableHead className="w-1/4 text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((pm) => (
                    <TableRow key={pm.id}>
                      <TableCell>{stringToTitleCase(pm.bank_name)}</TableCell>
                      <TableCell>
                        {stringToTitleCase(pm.bank_account?.account_type ?? "")}
                      </TableCell>
                      <TableCell className="text-end">
                        {pm.bank_account?.account_number}
                      </TableCell>
                      <TableCell className="text-end">
                        <RestrictByUserAppAttrsClient
                          allowedUserTypes={ALLOWED_USER_TYPES}
                          requiredUserRoles={[REQUIRED_USER_ROLE]}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeletePaymentMethod(pm.id);
                                }}
                                disabled={!userCanEdit || isPending}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </RestrictByUserAppAttrsClient>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
