export type UserRole = {
  id?: string;
  name: string;
  shortname: string;
  access?: any;
};

export type AuthenticatedUser = {
  id: string;
  username: string;
  role: UserRole;
};

export type JwtPayload = {
  sub: string;
  username: string;
  role: UserRole;
};

export type UserContext = {
  req: {
    user: AuthenticatedUser;
  };
};
