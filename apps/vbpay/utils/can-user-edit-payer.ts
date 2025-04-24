import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";

type props = {
  usersAppAttrs: UserAppAttrs;
  payerPubId: string;
  allowedUserTypes: UserType[];
};

/**
 * Checks if a user is allowed to edit a specific payer based on their attributes, the payer's identifier, and permitted user types.
 *
 * @param usersAppAttrs - The user's application attributes, including payer-specific permissions and user type.
 * @param payerPubId - The public identifier of the payer to check.
 * @param allowedUserTypes - Array of user types permitted to edit payers.
 * @returns `true` if the user has edit permissions for the specified payer; otherwise, `false`.
 */
export function canUserEditPayer({
  usersAppAttrs,
  payerPubId,
  allowedUserTypes,
}: props) {
  // get users payer specific permissions
  const payerPermissions = usersAppAttrs.ids?.find(
    (id) => id.id === payerPubId,
  );

  // assume user cannot edit
  let userCanEdit = false;

  // check if user can edit and update userCanEdit if they can
  if (
    payerPermissions &&
    allowedUserTypes.includes(usersAppAttrs.type) &&
    payerPermissions.userRoles.includes("edit")
  ) {
    userCanEdit = true;
  }

  return userCanEdit;
}
