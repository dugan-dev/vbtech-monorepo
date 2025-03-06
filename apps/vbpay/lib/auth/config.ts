import { type ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: "us-west-2_7ROyJvRJs",
    userPoolClientId: "1683drh65gvlacovqd1eovtbnl",
    identityPoolId: "us-west-2:5c162088-8835-40a9-b860-5177b3c71e93",
  },
};
