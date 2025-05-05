"use client";

import { useRouter } from "next/navigation";
import IntroDisclosure from "./ui/intro-disclosure";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

type StorageState = {
  desktop: string | null;
  mobile: string | null;
};

export default function IntroComponent() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [openMobile, setOpenMobile] = useState(true);
  const [debugOpen, setDebugOpen] = useState(false);
  const [storageState, setStorageState] = useState<StorageState>({
    desktop: null,
    mobile: null,
  });
  const t = useTranslations("intro");

  const [isMounted, setIsMounted] = useState(false);

  const { session } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const storedValue = localStorage.getItem(`feature_intro-demo`);

    if (!session) return;
    if (storageState.desktop === "false") {
      toast.info("Clear the local storage to trigger the feature again");
      setDebugOpen(true);
    } else {
      setOpen(true);
      updateStorageState();
    }
  }, [isMounted]);

  const steps = [
    {
      title: t("step1.title"),
      short_description: t("step1.short_description"),
      full_description: t("step1.full_description"),
      media: {
        type: "image" as const,
        src: "https://www.cult-ui.com/_next/image?url=%2Ffeature-3.png&w=1920&q=75",
        alt: "Cult UI components overview",
      },
    },
    {
      title: t("step2.title"),
      short_description: t("step2.short_description"),
      full_description: t("step2.full_description"),
      media: {
        type: "image" as const,
        src: "https://www.cult-ui.com/_next/image?url=%2Ffeature-3.png&w=1920&q=75",
        alt: "Component customization interface",
      },
      action: {
        label: "View Theme Builder",
        href: "/docs/theming",
      },
    },
    {
      title: t("step3.title"),
      short_description: "Built for everyone",
      full_description:
        "All components are fully responsive and follow WAI-ARIA guidelines, ensuring your application works seamlessly across all devices and is accessible to everyone.",
      media: {
        type: "image" as const,

        src: "https://www.cult-ui.com/_next/image?url=%2Ffeature-3.png&w=1920&q=75",
        alt: "Responsive design demonstration",
      },
    },
    {
      title: "Start Building",
      short_description: "Create your next project",
      full_description:
        "You're ready to start building! Check out our comprehensive documentation and component examples to create your next amazing project.",
      action: {
        label: "View Components",
        href: "/docs/components",
      },
    },
  ];

  const updateStorageState = () => {
    setStorageState({
      desktop: localStorage.getItem("feature_intro-demo"),
      mobile: localStorage.getItem("feature_intro-demo-mobile"),
    });
  };

  return (
    <IntroDisclosure
      open={open}
      setOpen={setOpen}
      steps={steps}
      featureId="intro-demo"
      showProgressBar={false}
      onComplete={() => toast.success("Tour completed")}
      onSkip={() => toast.info("Tour skipped")}
    />
  );
}
