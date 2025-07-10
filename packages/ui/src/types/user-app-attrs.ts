export type UserAppAttrs<TUserType = string, TUserRole = string> = {
  admin: boolean;
  type: TUserType;
  slug?: string;
  ids?: Array<{
    id: string;
    userRoles: TUserRole[];
  }>;
};