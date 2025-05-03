export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return (
    <div className="flex h-full w-full items-center justify-center">
      Chat {chatId}
    </div>
  );
}
