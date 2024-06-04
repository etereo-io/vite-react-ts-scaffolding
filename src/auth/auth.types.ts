export interface User {
  login: string;
  email: string;
  name: string;
  userId: string;
  roles: UserRoles[];
  permissions: string[];
  attributes: { key: string; values: string[] }[];
  userData: {
    description: string;
    employeeId: string;
    employeeNumber: number;
    id: string;
    login: string;
    mail: string;
    name: string;
  };
}

export enum UserRoles {
  ADMIN = "admin",
  STAFF = "staff",
}

export type RequiredPermissions = boolean | string | string[] | string[][];
