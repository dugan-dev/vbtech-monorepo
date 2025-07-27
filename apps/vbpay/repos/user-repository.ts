import { env } from "@/env/server";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { createUserRepository } from "@workspace/auth/lib/utils/user-repository";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { cognitoClient } from "@/lib/auth/cognito";

import { getAllPayers } from "./payer-repository";

// Create configured user repository for VBPay
const userRepository = createUserRepository<UserAppAttrs>({
  cognitoClient,
  userPoolId: env.AWS_COGNITO_USER_POOL_ID,
  customAttrName: "custom:app1:attrs", // VBPay uses app1
  getAllItems: async () => {
    const payers = await getAllPayers();
    return payers.map((payer) => ({
      label: formatMarketingAndRefName(
        payer.marketingName,
        payer.referenceName,
      ),
      value: payer.pubId,
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
