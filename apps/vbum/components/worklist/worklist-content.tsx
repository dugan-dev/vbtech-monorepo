"use client";

import { useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import { umCase } from "@/types/um-case";

import { WorklistTable } from "./worklist-table";

type props = {
  openCases: umCase[];
  closedCases: umCase[];
};

export function WorklistContent({ openCases, closedCases }: props) {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("open"));
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  const [statusFilter] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );
  const [clientFilter] = useQueryState(
    "client",
    parseAsString.withDefault("all"),
  );

  const filteredOpenCases = useMemo(() => {
    return openCases.filter((case_) => {
      const matchesSearch =
        case_.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        case_.clientName.toLowerCase().includes(search.toLowerCase()) ||
        case_.planName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || case_.status === statusFilter;
      const matchesClient =
        clientFilter === "all" || case_.clientPubId === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [openCases, search, statusFilter, clientFilter]);

  const filteredClosedCases = useMemo(() => {
    return closedCases.filter((case_) => {
      const matchesSearch =
        case_.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        case_.clientName.toLowerCase().includes(search.toLowerCase()) ||
        case_.planName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || case_.status === statusFilter;
      const matchesClient =
        clientFilter === "all" || case_.clientPubId === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [closedCases, search, statusFilter, clientFilter]);

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="open">
          Open Cases ({filteredOpenCases.length})
        </TabsTrigger>
        <TabsTrigger value="closed">
          Closed Cases ({filteredClosedCases.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="open" className="mt-0">
        <WorklistTable cases={filteredOpenCases} type="open" />
      </TabsContent>

      <TabsContent value="closed" className="mt-0">
        <WorklistTable cases={filteredClosedCases} type="closed" />
      </TabsContent>
    </Tabs>
  );
}
