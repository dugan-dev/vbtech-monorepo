import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type client = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientName: string;
  clientCode: string;
  timezone: string;
  description: string;
  isActive: Generated<number>;
};
export type client_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientName: string;
  clientCode: string;
  timezone: string;
  description: string;
  isActive: number;
};
export type health_plan = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientPubId: string;
  planName: string;
  isActive: Generated<number>;
};
export type health_plan_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientPubId: string;
  planName: string;
  isActive: number;
};
export type um_case = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  assignedAt: Timestamp;
  assignedTo: string;
  clientPubId: string;
  planPubId: string;
  caseNumber: string;
  mdReview: Generated<number>;
  mdName: string;
  fuAction: string;
  p2pSuccess: Generated<number>;
  status: string;
  remarks: string;
};
export type um_case_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  assignedAt: Timestamp;
  assignedTo: string;
  clientPubId: string;
  planPubId: string;
  caseNumber: string;
  mdReview: Generated<number>;
  mdName: string;
  fuAction: string;
  p2pSuccess: Generated<number>;
  status: string;
  remarks: string;
};
export type user = {
  id: Generated<number>;
  userId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type user_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  userId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type user_sync_timestamp = {
  id: Generated<number>;
  appName: string;
  lastSyncAt: Timestamp;
};
export type DB = {
  client: client;
  clientHist: client_hist;
  healthPlan: health_plan;
  healthPlanHist: health_plan_hist;
  umCase: um_case;
  umCaseHist: um_case_hist;
  user: user;
  userHist: user_hist;
  userSyncTimestamp: user_sync_timestamp;
};
