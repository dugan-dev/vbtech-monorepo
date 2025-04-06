"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

import { AdminSettingsSheet } from "../admin-settings-sheet";
import { SettingsContent } from "./settings-content";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

interface props {
  data: SetupFormData;
  usersAppAttrs: UserAppAttrs;
}

/**
 * Renders a card interface for VBPay global settings with conditionally accessible admin controls.
 *
 * The component displays a card with a header and a scrollable content area. The header includes a title and an
 * admin settings section that is only rendered for users whose application attributes match the allowed type ("bpo").
 * The provided settings data is used to populate both the admin and general settings sections.
 *
 * @param data - Settings data used to configure and display global settings.
 * @param usersAppAttrs - User attributes determining access to the admin settings section.
 */
export function SettingsCardClient({ data, usersAppAttrs }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>VBPay Global Settings</CardTitle>
          <RestrictByUserAppAttrsClient
            usersAppAttrs={usersAppAttrs}
            allowedUserTypes={ALLOWED_USER_TYPES}
            adminOnly
          >
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
