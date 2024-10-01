import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'employee' | null;
export const Months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
export type Month = typeof Months[number];

export const allColumns = ['name', 'date', 'numberOfPeople', 'contact', 'comment'];
export const defaultColumns = ['name', 'date', 'numberOfPeople'];

export interface AppUser {
    email: string,
    name?: string,
    role: UserRole;
}

export interface FilterOptions {
    searchQuery: string;
    visibleColumns: string[];
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
}

// Chat Message are between at least one user, and the admin. 
export interface ChatMessage {
    id: string; // Make id optional as it will be generated by Firestore
    message: string;
    sender: string; // id
    receiver: string[]; //ids
    timestamp: Date;
}


// Tasks are created by admins and assigned to users
// Tasks are only visible 
export interface EditingReservation {
    id?: string;
    name: string;
    dateStart: Date;
    dateEnd: Date;
    comment: string;
    numberOfPeople: number;
    contact: string[];
}

export interface Reservation extends EditingReservation {
    id: string;
}
