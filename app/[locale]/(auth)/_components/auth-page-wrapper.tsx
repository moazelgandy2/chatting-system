"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { LoginForm } from "./login-form";
import Image from "next/image";

export const AuthPageWrapper = () => {
  const i18n = useTranslations();
  return (
    <div className="w-full flex flex-col items-center justify-center h-full overflow-hidden">
      <Card className="w-full max-w-sm p-4 flex flex-col items-center justify-center gap-4">
        <CardHeader className="w-full">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-2xl font-bold text-center">
              {i18n("auth.title")}
            </h1>
            <Image
              src={"/logo.png"}
              width={28}
              height={28}
              alt="Logo"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {i18n("auth.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center justify-center gap-4">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};
