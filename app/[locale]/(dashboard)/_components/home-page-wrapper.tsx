"use client";

import Notification from "@/components/kokonutui/notification";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SignatureForm } from "./sign-component";

export const HomePageWrapper = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">This is the home page content.</p>

        <div className="flex gap-3 mt-8">
          <Button
            variant="default"
            onClick={() =>
              toast.custom((t) => (
                <Notification
                  message="This is a success message!"
                  type="success"
                />
              ))
            }
          >
            Show Success
          </Button>
          <Button
            variant="default"
            onClick={() =>
              toast.custom((t) => (
                <Notification
                  message="This is an error message!"
                  type="error"
                />
              ))
            }
          >
            Show Error
          </Button>
          <Button
            variant="default"
            onClick={() =>
              toast.custom((t) => (
                <Notification
                  message="This is an info message!"
                  type="info"
                />
              ))
            }
          >
            Show Info
          </Button>
          <Button
            variant="default"
            onClick={() =>
              toast.custom((t) => (
                <Notification
                  message="This is a warning message!"
                  type="warning"
                />
              ))
            }
          >
            Show Warning
          </Button>
        </div>
        <SignatureForm />
      </div>
    </div>
  );
};
