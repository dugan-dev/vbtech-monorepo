import { SignIn } from "@/routes";
import { APP_NAME } from "@/values/app-name";

import { timeouts } from "@workspace/auth/constants/timeouts";
import { useAutoLogout as useAutoLogoutBase } from "@workspace/auth/hooks/use-auto-logout";

/**
 * React hook that automatically signs out the user after a specified period of inactivity, clears sidebar state, and redirects to the sign-in page.
 *
 * @param minutes - Number of minutes of inactivity before triggering automatic logout. Defaults to configured timeout.
 *
 * @remark The inactivity timer resets on user activity such as mouse movement, key presses, clicks, or scrolling.
 */
export function useAutoLogout(minutes = timeouts.autoLogout.minutes) {
  return useAutoLogoutBase(
    {
      appName: APP_NAME,
      signInPath: SignIn({}),
    },
    minutes,
  );
}
