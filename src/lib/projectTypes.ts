import { User } from 'firebase/auth';

export interface UserWithRole extends User {
    role?: 'admin' | 'employee';
}

export type UserRole = 'admin' | 'employee' | null;

export interface AuthContextType {
    user: User | null;
    role: UserRole;
    loading: boolean;
}

// ... any other project-specific types and interfaces ...