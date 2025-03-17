const NPPES_BASE_API_URL = "https://npiregistry.cms.hhs.gov/api/";

const NPPES_API_VERSION = "2.1";

const NPPES_ENUMERATION_TYPE_INDIVIDUAL = "NPI-1";
const NPPES_ENUMERATION_TYPE_ORGANIZATION = "NPI-2";

const NPPES_PROVIDER_STATUS_CODE_VALUES = [{ code: "A", display: "Active" }];

const NPPES_PROVIDER_GENDER_CODE_VALUES = [
  { code: "M", display: "Male" },
  { code: "F", display: "Female" },
];

const NPPES_IS_SOLE_PROPRIETOR_VALUES = [
  { code: "YES", display: "Yes" },
  { code: "NO", display: "No" },
  { code: "X", display: "Not Answered" },
];

const NPPES_OTHER_NAME_TYPE_VALUES = [
  { code: "1", display: "Former Name" },
  { code: "2", display: "Professional Name" },
  { code: "3", display: "Doing Business As" },
  { code: "4", display: "Former Legal Business Name" },
  { code: "5", display: "Other Name" },
];

export {
  NPPES_BASE_API_URL,
  NPPES_API_VERSION,
  NPPES_ENUMERATION_TYPE_INDIVIDUAL,
  NPPES_ENUMERATION_TYPE_ORGANIZATION,
  NPPES_PROVIDER_STATUS_CODE_VALUES,
  NPPES_PROVIDER_GENDER_CODE_VALUES,
  NPPES_IS_SOLE_PROPRIETOR_VALUES,
  NPPES_OTHER_NAME_TYPE_VALUES,
};
