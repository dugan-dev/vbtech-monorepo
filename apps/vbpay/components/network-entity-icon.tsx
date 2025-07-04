import { Building, Building2, Hotel, Store } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

import { NetworkEntityType } from "@/types/network-entity-type";

type props = {
  netEntType: NetworkEntityType;
  className?: string;
};

export function NetworkEntityIcon({ netEntType, className }: props) {
  switch (netEntType) {
    case "po":
      return <Building2 className={cn("h-6 w-6", className)} />;
    case "prac":
      return <Building className={cn("h-6 w-6", className)} />;
    case "facl":
      return <Hotel className={cn("h-6 w-6", className)} />;
    case "vendor":
      return <Store className={cn("h-6 w-6", className)} />;
  }
}
