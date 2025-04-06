import { SETTINGS_GROUPS } from "@/values/global-settings-groups";

import { SetupFormData } from "@/components/setup-form/setup-form-schema";

interface props {
  data: SetupFormData;
}

/**
 * Renders a grid layout displaying allowed payer types and enabled settings groups.
 *
 * If the provided data contains allowed payer types, they are shown in a dedicated section with each type in uppercase.
 * For each settings group defined in SETTINGS_GROUPS, the component displays the group's title and a list of settings
 * that are enabled in the global settings. If no global settings are enabled and there are no allowed payer types,
 * a "No settings enabled" message is displayed.
 *
 * @param data - An object containing global settings including allowed payer types and various configuration flags.
 */
export function SettingsContent({ data }: props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.globalSettings.allowedPayerTypes &&
        data.globalSettings.allowedPayerTypes.length > 0 && (
          <div className="space-y-1">
            <h3 className="font-semibold">Allowed Payer Types</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {data.globalSettings.allowedPayerTypes.map((type) => (
                <li key={type}>{type.toUpperCase()}</li>
              ))}
            </ul>
          </div>
        )}
      {SETTINGS_GROUPS.map((group) => {
        const enabledSettings = group.settings.filter(
          (setting) =>
            data.globalSettings[
              setting.name as keyof typeof data.globalSettings
            ],
        );
        if (enabledSettings.length === 0) return null;
        return (
          <div key={group.title} className="space-y-1">
            <h3 className="font-semibold">{group.title}</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {enabledSettings.map((setting) => (
                <li key={setting.name}>{setting.label}</li>
              ))}
            </ul>
          </div>
        );
      })}
      {Object.values(data.globalSettings).every((value) => !value) &&
        data.globalSettings.allowedPayerTypes.length === 0 && (
          <p className="text-sm text-muted-foreground">No settings enabled</p>
        )}
    </div>
  );
}
