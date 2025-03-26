import { RowData } from "@tanstack/react-table";

import { ComboItem } from "./combo-item";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DataTableMeta<_TData> = {
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  returnFormData?: (data: any) => void;
  payers?: ComboItem[];
  pos?: ComboItem[];
  facilities?: ComboItem[];
  practices?: ComboItem[];
  physicians?: DataTablePhysician[];
  vendors?: ComboItem[];
  viewingFrom?: DataTableViewingContext;
  selectedProcedureCodes?: DataTableProcedureCode[];
  selectedApprovers?: DataTableSelectedApprover[];
  deleteAllSelectedProcedureCodes?: () => void;
  deleteAllSelectedApprovers?: () => void;
  deleteSelectedProcedureCode?: (procCode: string) => void;
  deleteSelectedApprover?: (userId: string) => void;
  updateSelectedProcedureCode?: (prcdCode: DataTableProcedureCode) => void;
  updateSelectedApprover?: (approver: DataTableApprover) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  usersAppAttrs?: any;
};

type DataTableProcedureCode = {
  procCode: string;
  procCodeType: string;
  description: string;
  ffsPct?: string;
  ffsPctAdjMethod?: string;
};

type DataTableSelectedApprover = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isRequired?: number;
};

type DataTablePhysician = {
  physPubId: string;
  physType: string;
  physDisplayName: string;
};

type DataTableViewingContext =
  | "physician"
  | "facility"
  | "practice"
  | "po"
  | "payer";

type DataTableApprover = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isRequired: number | null;
};

export {
  type DataTableMeta,
  type DataTableProcedureCode,
  type DataTableSelectedApprover,
  type DataTablePhysician,
  type DataTableViewingContext,
  type DataTableApprover,
};

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    meta?: DataTableMeta<TData>;
  }
}
