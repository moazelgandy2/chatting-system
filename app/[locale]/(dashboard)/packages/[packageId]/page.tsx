import { PackagePageWrapper } from "./package-page-wrapper";

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = await params;

  return <PackagePageWrapper packageId={packageId} />;
}
