"use client";

import { useWorklistContext } from "@/contexts/worklist-context";
import { Filter, Search } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { DebouncedInput } from "@workspace/ui/components/debounced-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { CaseStatuses, CaseStatusLabels } from "@/types/case-status";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

/**
 * Renders a set of worklist filter controls and wires them to query state.
 *
 * Includes a debounced search input and dropdowns for status, client, and (when permitted) nurse; updating any control updates the corresponding query parameter.
 *
 * @returns The JSX element containing the filter controls
 */
export function WorklistFilters() {
  const { clients, nurses } = useWorklistContext();
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsString.withDefault("all"),
      client: parseAsString.withDefault("all"),
      nurse: parseAsString.withDefault("all"),
    },
    {
      shallow: false,
    },
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <DebouncedInput
          placeholder="Search across all fields..."
          value={filters.search}
          onChange={(value) => setFilters({ search: value as string })}
          debounce={500}
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters({ status: value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {CaseStatuses.map((caseStatus) => (
            <SelectItem value={caseStatus} key={caseStatus}>
              {CaseStatusLabels[caseStatus]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.client}
        onValueChange={(value) => setFilters({ client: value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.value} value={client.value}>
              {client.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <RestrictByUserAppAttrsClient
        allowedUserTypes={["auditor", "ops", "reporting"]}
      >
        <Select
          value={filters.nurse}
          onValueChange={(value) => setFilters({ nurse: value })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Nurse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Nurses</SelectItem>
            {nurses.map((nurse) => (
              <SelectItem key={nurse.userId} value={nurse.userId}>
                {`${nurse.firstName} ${nurse.lastName}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </RestrictByUserAppAttrsClient>
    </div>
  );
}