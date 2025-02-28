import { Resource } from "sst";

import { Button } from "@workspace/ui/components/button";

export default async function Page() {
  const dbName = Resource.VBPayDB.name;
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
        <p>{dbName}</p>
      </div>
    </div>
  );
}
