"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { UserAppAttrs } from "@/types/user-app-attrs";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

import { AdminSettingsSheet } from "../admin-settings-sheet";
import { SettingsContent } from "./settings-content";

type props = {
  data: SetupFormData;
  usersAppAttrs: UserAppAttrs;
};

/**
 * Renders the VBPay Global Settings card.
 *
 * Displays a card with a header showing the "VBPay Global Settings" title and, for users with the appropriate attributes,
 * an admin settings sheet. The main content is presented within a scrollable area to accommodate varying content lengths.
 *
 * @param data - The setup form data for configuring and displaying settings.
 * @param usersAppAttrs - The user application attributes used to determine access to admin settings.
 */
export function SettingsCardClient({ data, usersAppAttrs }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>VBPay Global Settings</CardTitle>
          <RestrictByUserAppAttrsClient usersAppAttrs={usersAppAttrs} adminOnly>
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
