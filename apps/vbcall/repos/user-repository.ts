import { env } from "@/env/server";

import { createUserRepository } from "@workspace/auth/lib/utils/user-repository";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { cognitoClient } from "@/lib/auth/cognito";

import { getAllClients } from "./clients-repository";

// Create configured user repository for VBCall
const userRepository = createUserRepository<UserAppAttrs>({
  cognitoClient,
  customAttrName: "custom:app2:attrs", // VBCall uses app2
  userPoolId: env.AWS_COGNITO_USER_POOL_ID,
  getAllItems: async () => {
    const clients = await getAllClients();
    return clients.map((client) => ({
      label: client.clientName,
      value: client.pubId,
    }));
  },
});

export const {
  getUsersData,
  updateUserSelectionSlug,
  getUserSelectionData,
  getUserCacheKey,
  USERS_DATA_CACHE_TAG,
} = userRepository;
