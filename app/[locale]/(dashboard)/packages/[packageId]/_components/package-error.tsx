import React from "react";
import { Package as PackageIcon } from "lucide-react";

export const PackageError = () => {
  return (
    <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-red-500/20 p-3">
          <PackageIcon className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold">Failed to load package</h3>
        <p className="text-muted-foreground">
          An error occurred while loading the package.
        </p>
      </div>
    </div>
  );
};
