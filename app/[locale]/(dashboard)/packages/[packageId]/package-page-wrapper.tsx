"use client";

export function PackagePageWrapper({ packageId }: { packageId: string }) {
  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Package Page {packageId}</h1>
        <p>This is the package page content.</p>
      </div>
    </>
  );
}
