export const SETTINGS_GROUPS = [
  {
    title: "Payer Settings",
    settings: [{ name: "payerReqTaxId", label: "Payer Requires Tax ID" }],
  },
  {
    title: "Physician Organization Settings",
    settings: [
      { name: "poReqTaxId", label: "Requires Tax ID" },
      { name: "poReqNpi", label: "Requires Org NPI" },
    ],
  },
  {
    title: "Practice Settings",
    settings: [
      { name: "pracReqNpi", label: "Requires Org NPI" },
      { name: "pracReqTaxId", label: "Requires Tax ID" },
    ],
  },
  {
    title: "Facility Settings",
    settings: [
      { name: "faclReqNpi", label: "Requires Org NPI" },
      { name: "faclReqTaxId", label: "Requires Tax ID" },
    ],
  },
  {
    title: "Physician Settings",
    settings: [
      { name: "physReqTaxId", label: "Requires Tax ID" },
      { name: "physReqCred", label: "Requires Credentials" },
      { name: "physReqSpec", label: "Requires Specialty" },
      { name: "physNppesRecon", label: "Requires NPPES Recon" },
    ],
  },
];
