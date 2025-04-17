import { cn } from "@workspace/ui/lib/utils";

import { NetworkEntityType } from "@/types/network-entity-type";
import { Icons } from "@/components/icons";

type props = {
  netEntType: NetworkEntityType;
  className?: string;
};

export function NetworkEntityIcon({ netEntType, className }: props) {
  switch (netEntType) {
    case "po":
      return <Icons.building2 className={cn("h-6 w-6", className)} />;
    case "prac":
      return <Icons.building className={cn("h-6 w-6", className)} />;
    case "facl":
      return <Icons.hotel className={cn("h-6 w-6", className)} />;
    case "vendor":
      return <Icons.store className={cn("h-6 w-6", className)} />;
  }
}
