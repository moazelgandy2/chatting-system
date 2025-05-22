import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simulate recent chats data
const getRecentChats = (locale: string) => {
  const titles = {
    en: {
      "1": "Sales Inquiry",
      "2": "Technical Support",
      "3": "Product Feedback",
    },
    ar: {
      "1": "استفسار المبيعات",
      "2": "الدعم الفني",
      "3": "تعليقات المنتج",
    },
  };

  const localizedTitles = titles[locale as keyof typeof titles] || titles.en;

  return [
    {
      id: "1",
      title: localizedTitles["1"],
      lastMessage: "I'm interested in your product",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      title: localizedTitles["2"],
      lastMessage: "How do I reset my password?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: localizedTitles["3"],
      lastMessage: "I love your new features!",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export default async function ChatsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("chat");
  const recentChats = getRecentChats(locale);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("chats.title")}</h1>
        <Button asChild>
          <Link href={`/${locale}/chats/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("messageArea.newChat")}
          </Link>
        </Button>
      </div>

      {recentChats.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">
            {t("messageArea.emptyState")}
          </h2>
          <p className="text-muted-foreground">
            {t("messageArea.startConversation")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentChats.map((chat) => (
            <Link
              key={chat.id}
              href={`/${locale}/chats/${chat.id}`}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{chat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleString(locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
