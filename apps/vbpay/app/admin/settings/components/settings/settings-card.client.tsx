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
