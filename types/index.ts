export type SessionType = {
  user: UserType;
  token?: string;
};

export type RoleType = "admin" | "client" | "team";

export type UserType = {
  name: string;
  email: string;
  role: RoleType;
};
