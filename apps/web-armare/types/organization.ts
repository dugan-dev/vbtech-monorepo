export type OrganizationInfo = {
  name: string;
  description: string[];
  keyInfo: {
    organizationType: string;
    primaryFunction: string;
    regulatoryAuthority: string;
    reviewType: string;
  };
  badges: string[];
};
