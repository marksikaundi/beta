/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as changelog from "../changelog.js";
import type * as discussions from "../discussions.js";
import type * as discussions_reply from "../discussions_reply.js";
import type * as leaderboards from "../leaderboards.js";
import type * as lessons from "../lessons.js";
import type * as lessons_admin from "../lessons_admin.js";
import type * as notifications from "../notifications.js";
import type * as progress from "../progress.js";
import type * as tracks from "../tracks.js";
import type * as tracks_admin from "../tracks_admin.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  changelog: typeof changelog;
  discussions: typeof discussions;
  discussions_reply: typeof discussions_reply;
  leaderboards: typeof leaderboards;
  lessons: typeof lessons;
  lessons_admin: typeof lessons_admin;
  notifications: typeof notifications;
  progress: typeof progress;
  tracks: typeof tracks;
  tracks_admin: typeof tracks_admin;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
