export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | string;


export interface UserProfile {
  fullName: string;
  phoneNumber: string;
  username: string;
  role: Role;
}
