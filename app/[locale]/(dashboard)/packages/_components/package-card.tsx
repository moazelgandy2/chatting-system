import { Button } from "@/components/ui/button";
import MinimalCard, {
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";
import Link from "next/link";

interface PackageCardProps {
  src: string;
  name: string;
  description: string;
  id: number;
}

export const PackageCard = ({
  src,
  name,
  description,
  id,
}: PackageCardProps) => {
  return (
    <MinimalCard>
      <MinimalCardImage
        src={src}
        alt={name}
      />
      <MinimalCardTitle>{name}</MinimalCardTitle>
      <MinimalCardDescription>
        <div className="flex flex-col gap-2">
          {description}
          <Link
            href={`/packages/${id}`}
            className="w-full"
          >
            <Button
              size={"sm"}
              className="w-full cursor-pointer "
            >
              Go to Details
            </Button>
          </Link>
        </div>
      </MinimalCardDescription>
    </MinimalCard>
  );
};
