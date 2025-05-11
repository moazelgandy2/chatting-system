// type UsersMessages = typeof import("./messages/en/users.json");
type AuthMessages = typeof import("./messages/en/auth.json");
type DashboardMessages = typeof import("./messages/en/dashboard.json");
type ChatMessages = typeof import("./messages/en/chat.json");
type IntroMessages = typeof import("./messages/en/intro.json");
type PackageMessages = typeof import("./messages/en/package.json");

// Importing other language files ..

// Create a new type by combining all message types
type Messages = AuthMessages &
  DashboardMessages &
  ChatMessages &
  IntroMessages &
  PackageMessages;

declare interface IntlMessages extends Messages {}
