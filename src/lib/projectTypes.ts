import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'employee' | null;

export interface AuthContextType {
    user: User | null;
    role: UserRole;
    loading: boolean;
}

export interface AppUser {
    email: string,
    role: UserRole;
}
// ... any other project-specific types and interfaces ...