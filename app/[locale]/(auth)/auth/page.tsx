import BackgroundPaths from "@/components/kokonutui/background-paths";
import { AuthPageWrapper } from "../_components/auth-page-wrapper";

export default function AuthPage() {
  return (
    <div className="w-full h-[100vh] ">
      <BackgroundPaths content={<AuthPageWrapper />} />
    </div>
  );
}
