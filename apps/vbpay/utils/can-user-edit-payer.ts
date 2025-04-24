import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";

type props = {
  usersAppAttrs: UserAppAttrs;
  payerPubId: string;
  allowedUserTypes: UserType[];
};

/**
 * Determines whether a user has permission to edit a specific payer.
 *
 * @param usersAppAttrs - The user's application attributes, including payer-specific permissions and user type.
 * @param payerPubId - The public identifier of the payer to check permissions for.
 * @param allowedUserTypes - The user types that are permitted to edit payers.
 * @returns `true` if the user can edit the specified payer; otherwise, `false`.
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
