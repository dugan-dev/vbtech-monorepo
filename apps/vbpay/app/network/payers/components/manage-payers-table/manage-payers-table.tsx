"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { Payer } from "@/types/payer";
import { UserType } from "@/types/user-type";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";

import { AddPayerSheet } from "../add-payer-sheet";
import { ManagePayersTableColumns } from "./manage-payers-table-columns";

type props = {
  payers: Payer[];
  usersType: UserType;
  payerTypes: ComboItem[];
};

export function ManagePayersTable({ payers, usersType, payerTypes }: props) {
  if (payers.length === 0) {
    return (
      <EmptyView
        title="No Payers Yet"
        description="Get started by adding your first payer to the system."
        icon={<Icons.heartHandshake className="h-12 w-12 text-gray-400 mb-4" />}
      >
        {/* Only show the add payer sheet if the user is a BPO <UserIsClient usersType={usersType} userType="bpo"> */}
        <AddPayerSheet payerTypes={payerTypes} />
        {/* </UserIsClient> */}
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={ManagePayersTableColumns}
      data={payers}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      initialColumnVisibility={{
        "Legal Business Name": false,
        "Parent Organization": false,
        "Website URL": false,
      }}
      // TODO: Wrap with <UserIsClient usersType={usersType} userType="bpo">
      itemsAboveTable={<AddPayerSheet payerTypes={payerTypes} />}
      meta={{
        usersType,
      }}
    />
  );
}
