"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Form } from "@workspace/ui/components/form";
import { FormCheckbox } from "@workspace/ui/components/form/form-checkbox";
import { FormCheckboxList } from "@workspace/ui/components/form/form-checkbox-list";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { Label } from "@workspace/ui/components/label";

import { UserCognito } from "@/types/user-cognito";

import { useUserManagementContext } from "../contexts/user-management-context";
import { useUserForm } from "../hooks/use-user-form";

type props = {
  user?: UserCognito;
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActionPending?: React.Dispatch<React.SetStateAction<boolean>>;
  isActionPending?: boolean;
};

/**
 * Render a modal dialog for creating or editing a user.
 *
 * @param user - Optional existing user; when provided the dialog is in edit mode
 * @param open - Whether the dialog is visible
 * @param setIsOpen - Callback to update the dialog's open state
 * @param setIsActionPending - Optional callback to mark an action as pending (used by the form)
 * @param isActionPending - Optional flag indicating whether a save action is in progress
 * @returns A React element that displays the user form dialog with fields for name, email, type, client access, and permissions
 */
export function UserDialog({
  user,
  open,
  setIsOpen,
  setIsActionPending,
  isActionPending,
}: props) {
  const {
    form,
    onSubmit,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useUserForm({
    onSuccess: () => setIsOpen(false),
    user,
    setIsSubmitting: setIsActionPending,
  });

  const { clients, userTypes } = useUserManagementContext();

  return (
    <>
      {isErrorDialogOpen && (
        <ErrorDialog
          description={errorMsg}
          title={errorTitle}
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
        />
      )}
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {user
                ? "Update user information and permissions"
                : "Create a new user account with role-based permissions"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className="space-y-8"
            >
              <fieldset
                className="space-y-5 py-4"
                disabled={isActionPending ?? false}
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    type="text"
                    label="First Name"
                    name="firstName"
                    isRequired
                  />
                  <FormInput
                    control={form.control}
                    type="text"
                    label="Last Name"
                    name="lastName"
                    isRequired
                  />
                </div>
                <FormInput
                  control={form.control}
                  type="email"
                  name="email"
                  label="Email"
                  isRequired
                />
                <FormCombo
                  control={form.control}
                  comboItems={userTypes}
                  name="type"
                  label="Type"
                  isRequired
                />

                <FormCheckboxList
                  control={form.control}
                  name="ids"
                  label="Client Access"
                  items={clients}
                  isRequired
                  labelFirst={true}
                />

                <div className="space-y-3">
                  <Label className="text-lg">Permissions</Label>
                  <FormCheckbox
                    control={form.control}
                    name="admin"
                    label="Administrator"
                    labelFirst={true}
                    description="Can manage users, setting and system configuration."
                  />
                  <FormCheckbox
                    control={form.control}
                    name="super"
                    label="Super User"
                    labelFirst={true}
                    description="Can access all cases and override system restrictions."
                  />
                </div>
              </fieldset>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <FormSubmitButton isSaving={isActionPending ?? false} />
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}