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

/*
{
      "errors": {
            "key": "email.0",
        "message": {
            "key": "email.unique",
            "message": "Email already exists"
        }
    }
}
*/

export type ApiErrorType = {
  errors: {
    key: string;
    message: string;
  };
};
