import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Renders a skeleton placeholder for a settings card interface.
 *
 * This component displays a loading state for a global settings card layout, featuring a header with a title
 * and an icon placeholder, alongside a scrollable area with multiple skeleton items representing the settings options.
 * It provides visual feedback to users while the actual settings data is being loaded.
 */
export function SettingsCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Global Settings</CardTitle>
          <Skeleton className="h-9 w-9" />
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
