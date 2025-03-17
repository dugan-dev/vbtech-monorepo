"use server";

import "server-only";

import {
  fetchNppesApiResponse,
  NppesSearchParamsSchema,
} from "@/repos/nppes-repository";

import { authedActionClient } from "@/lib/safe-action";

export const fetchNppesApiResponseAction = authedActionClient
  .metadata({ actionName: "fetchNppesApiResponseAction" })
  .schema(NppesSearchParamsSchema)
  .action(
    async ({
      parsedInput: {
        npiType,
        npi,
        firstName,
        lastName,
        orgName,
        city,
        state,
        zip,
        taxonomy,
      },
    }) => {
      return fetchNppesApiResponse({
        npiType,
        npi,
        firstName,
        lastName,
        orgName,
        city,
        state,
        zip,
        taxonomy,
      });
    },
  );
