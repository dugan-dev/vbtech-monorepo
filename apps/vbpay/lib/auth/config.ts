import { type ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: "us-west-2_tTyr5jsaW",
    userPoolClientId: "7l22slu2jncj8n1k7khvb6fsnj",
    identityPoolId: "us-west-2:17ae64c4-99c7-4f47-8153-97c731a8bbbb",
  },
};
