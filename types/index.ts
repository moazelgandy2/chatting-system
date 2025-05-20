export type SessionType = {
  user: UserType;
  token?: string;
};

export type RoleType = "admin" | "client" | "team";

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: RoleType;
};

export type CreateUserType = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: RoleType;
};

export type ApiErrorType = {
  errors: {
    key: string;
    message: string;
  };
};

export type PackageStatus = "active" | "expired";
export type SubmissionStatus = "accepted" | "rejected" | "edited";

export interface Package {
  id: string;
  name: string;
  status: PackageStatus;
  startDate: string;
  endDate: string;
  clientName: string;
  items: ContentItem[];
}

export interface ContentItem {
  id: string;
  type: string;
  icon: string;
  totalAllowed: number;
  used: number;
  description: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  title: string;
  status: SubmissionStatus;
  dateSubmitted: string;
  thumbnailUrl: string;
  description: string;
  featured?: boolean;
}

export * from "./packages";
