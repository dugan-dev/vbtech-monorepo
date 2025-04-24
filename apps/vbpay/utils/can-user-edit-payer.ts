import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";

type props = {
  usersAppAttrs: UserAppAttrs;
  payerPubId: string;
  allowedUserTypes: UserType[];
};

/**
 * Returns whether the user has permission to edit the specified payer.
 *
 * Checks if the user has payer-specific permissions, belongs to an allowed user type, and holds the "edit" role for the payer.
 *
 * @returns `true` if the user can edit the payer; otherwise, `false`.
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
