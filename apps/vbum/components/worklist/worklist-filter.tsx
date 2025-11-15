"use client";

import { useWorklistContext } from "@/contexts/worklist-context";
import { Filter, Search } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export function WorklistFilters() {
  const { clients } = useWorklistContext();
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsString.withDefault("all"),
      client: parseAsString.withDefault("all"),
    },
    {
      shallow: false,
    },
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by case number, client, or health plan..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
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
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Moved to MD">Moved to MD</SelectItem>
          <SelectItem value="Offer P2P">Offer P2P</SelectItem>
          <SelectItem value="P2P Scheduled">P2P Scheduled</SelectItem>
          <SelectItem value="Withdrawn">Withdrawn</SelectItem>
          <SelectItem value="Not reviewed">Not reviewed</SelectItem>
          <SelectItem value="Denied">Denied</SelectItem>
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
    </div>
  );
}
