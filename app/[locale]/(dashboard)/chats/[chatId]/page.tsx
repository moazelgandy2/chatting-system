import ChatPageWrapper from "./chat-page-wrapper";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string; locale: string }>;
}) {
  const { chatId, locale } = await params;

  return (
    <div className="flex relative px-2 h-full overflow-hidden w-full items-center justify-center">
      <ChatPageWrapper
        chatId={chatId}
        locale={locale}
      />
    </div>
  );
}
