"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

import { AdminSettingsSheet } from "../admin-settings-sheet";
import { SettingsContent } from "./settings-content";

type props = {
  data: SetupFormData;
};

/**
 * Renders the VBPay Global Settings card with admin-restricted controls and main settings content.
 *
 * Displays a card containing the global settings title, an admin-only settings sheet, and a scrollable area with the main settings content populated from {@link data}.
 *
 * @param data - The setup form data used to populate the settings content.
 */
export function SettingsCardClient({ data }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>VBPay Global Settings</CardTitle>
          <RestrictByUserAppAttrsClient adminOnly>
            <AdminSettingsSheet data={data} from="settings" />
          </RestrictByUserAppAttrsClient>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <SettingsContent data={data} />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
