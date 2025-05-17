export const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 items-start animate-pulse mb-4">
      <div className="h-9 w-9 rounded-full bg-muted-foreground/20 shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-20 rounded bg-muted-foreground/20 shimmer" />
        <div className="h-4 w-40 rounded bg-muted-foreground/20 shimmer" />
        <div className="h-3 w-16 rounded bg-muted-foreground/10 shimmer" />
      </div>
    </div>
  );
};

export const MessageSkeletonGroup = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4 py-2">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <MessageSkeleton key={i} />
        ))}
    </div>
  );
};
