import { UserAppAttrs } from "./user-app-attrs";

export type UserCognito = {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
  appAttrs: UserAppAttrs;
  accountStatus: string;
  confirmationStatus: string;
  createdAt: Date;
  lastUpdatedAt: Date;
};
