// type UsersMessages = typeof import("./messages/en/users.json");
type AuthMessages = typeof import("./messages/en/auth.json");
type AuthMessages = typeof import("./messages/ar/auth.json");

// Importing other language files ..

// Create a new type by combining all message types
type Messages = UsersMessages & AuthMessages;

declare interface IntlMessages extends Messages {}
