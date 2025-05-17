import * as React from "react";
import ChatPageWrapper from "./_components/chat-page-wrapper";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string; locale: string }>;
}) {
  const { chatId, locale } = await params;

  return (
    <div className="flex relative px-2 h-full overflow-hidden w-full items-center justify-center">
      <React.Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="space-y-6 w-full max-w-2xl">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start animate-pulse"
                  >
                    <div className="h-9 w-9 rounded-full bg-muted-foreground/20 shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 rounded bg-muted-foreground/20 shimmer" />
                      <div className="h-4 w-40 rounded bg-muted-foreground/20 shimmer" />
                      <div className="h-3 w-16 rounded bg-muted-foreground/10 shimmer" />
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex w-full gap-2 items-center mt-8 max-w-2xl">
              <div className="h-10 flex-1 rounded bg-muted-foreground/20 shimmer animate-pulse" />
              <div className="h-10 w-10 rounded bg-muted-foreground/20 shimmer animate-pulse" />
            </div>
          </div>
        }
      >
        <ChatPageWrapper
          chatId={chatId}
          locale={locale}
        />
      </React.Suspense>
    </div>
  );
}
