// Automatically generated by declarative-routing, do NOT edit
import { z } from "zod";

import * as ActivityScheduleRoute from "@/app/activity/schedule/page.info";
import * as ActivityStatusRoute from "@/app/activity/status/page.info";
import * as ActivityUploadRoute from "@/app/activity/upload/page.info";
import * as AdminSettingsRoute from "@/app/admin/settings/page.info";
import * as AdminUsersRoute from "@/app/admin/users/page.info";
import * as BeneficiariesAlignmentRoute from "@/app/beneficiaries/alignment/page.info";
import * as BeneficiariesAttributionRoute from "@/app/beneficiaries/attribution/page.info";
import * as BeneficiariesSearchRoute from "@/app/beneficiaries/search/page.info";
import * as BeneficiaryRoute from "@/app/beneficiary/[slug]/page.info";
import * as NetworkEntitiesRoute from "@/app/network/entities/page.info";
import * as NetworkEntityRoute from "@/app/network/entity/[slug]/page.info";
import * as NetworkPayerRoute from "@/app/network/payer/[slug]/page.info";
import * as NetworkPayersRoute from "@/app/network/payers/page.info";
import * as NetworkPhysicianRoute from "@/app/network/physician/[slug]/page.info";
import * as NetworkPhysiciansRoute from "@/app/network/physicians/page.info";
import * as HomeRoute from "@/app/page.info";
import * as QueuesCompletedRoute from "@/app/queues/completed/page.info";
import * as QueuesManageRoute from "@/app/queues/manage/page.info";
import * as QueuesWorkRoute from "@/app/queues/work/page.info";
import * as ShareFilesRoute from "@/app/share/files/page.info";
import * as ShareNotificationDetailRoute from "@/app/share/notifications/[slug]/page.info";
import * as RecentShareNotificationsRoute from "@/app/share/notifications/recent/page.info";
import * as SignInRoute from "@/app/sign-in/[[...sign-in]]/page.info";

import { makeRoute } from "./makeRoute";

const defaultInfo = {
  search: z.object({}),
};

export const Home = makeRoute("/", {
  ...defaultInfo,
  ...HomeRoute.Route,
});
export const ActivitySchedule = makeRoute("/activity/schedule", {
  ...defaultInfo,
  ...ActivityScheduleRoute.Route,
});
export const ActivityStatus = makeRoute("/activity/status", {
  ...defaultInfo,
  ...ActivityStatusRoute.Route,
});
export const ActivityUpload = makeRoute("/activity/upload", {
  ...defaultInfo,
  ...ActivityUploadRoute.Route,
});
export const AdminSettings = makeRoute("/admin/settings", {
  ...defaultInfo,
  ...AdminSettingsRoute.Route,
});
export const AdminUsers = makeRoute("/admin/users", {
  ...defaultInfo,
  ...AdminUsersRoute.Route,
});
export const BeneficiariesAlignment = makeRoute("/beneficiaries/alignment", {
  ...defaultInfo,
  ...BeneficiariesAlignmentRoute.Route,
});
export const BeneficiariesAttribution = makeRoute(
  "/beneficiaries/attribution",
  {
    ...defaultInfo,
    ...BeneficiariesAttributionRoute.Route,
  },
);
export const BeneficiariesSearch = makeRoute("/beneficiaries/search", {
  ...defaultInfo,
  ...BeneficiariesSearchRoute.Route,
});
export const Beneficiary = makeRoute("/beneficiary/[slug]", {
  ...defaultInfo,
  ...BeneficiaryRoute.Route,
});
export const NetworkEntities = makeRoute("/network/entities", {
  ...defaultInfo,
  ...NetworkEntitiesRoute.Route,
});
export const NetworkEntity = makeRoute("/network/entity/[slug]", {
  ...defaultInfo,
  ...NetworkEntityRoute.Route,
});
export const NetworkPayer = makeRoute("/network/payer/[slug]", {
  ...defaultInfo,
  ...NetworkPayerRoute.Route,
});
export const NetworkPayers = makeRoute("/network/payers", {
  ...defaultInfo,
  ...NetworkPayersRoute.Route,
});
export const NetworkPhysician = makeRoute("/network/physician/[slug]", {
  ...defaultInfo,
  ...NetworkPhysicianRoute.Route,
});
export const NetworkPhysicians = makeRoute("/network/physicians", {
  ...defaultInfo,
  ...NetworkPhysiciansRoute.Route,
});
export const QueuesCompleted = makeRoute("/queues/completed", {
  ...defaultInfo,
  ...QueuesCompletedRoute.Route,
});
export const QueuesManage = makeRoute("/queues/manage", {
  ...defaultInfo,
  ...QueuesManageRoute.Route,
});
export const QueuesWork = makeRoute("/queues/work", {
  ...defaultInfo,
  ...QueuesWorkRoute.Route,
});
export const ShareFiles = makeRoute("/share/files", {
  ...defaultInfo,
  ...ShareFilesRoute.Route,
});
export const ShareNotificationDetail = makeRoute(
  "/share/notifications/[slug]",
  {
    ...defaultInfo,
    ...ShareNotificationDetailRoute.Route,
  },
);
export const RecentShareNotifications = makeRoute(
  "/share/notifications/recent",
  {
    ...defaultInfo,
    ...RecentShareNotificationsRoute.Route,
  },
);
export const SignIn = makeRoute("/sign-in/[[...sign-in]]", {
  ...defaultInfo,
  ...SignInRoute.Route,
});
