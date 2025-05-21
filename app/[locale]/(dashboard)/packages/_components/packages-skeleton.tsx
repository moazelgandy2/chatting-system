import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PackagesSkeleton() {
  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="w-full max-w-5xl ">
        <div className="flex flex-col justify-center rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-center ">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-1/3 p-2"
              >
                <Card>
                  <CardHeader>
                    <Skeleton className="h-32 w-full" />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-24" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
