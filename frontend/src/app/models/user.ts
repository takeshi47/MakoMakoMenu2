export interface User {
  id: number;
  email: string;
  roles: string[];
  displayName: string;
  lastLoggedInAt: string | null;
}
