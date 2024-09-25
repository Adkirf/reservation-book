import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Reservation } from '../projectTypes';
import { db } from './config';

// Use db for all Firestore operations

export const addUser = async (email: string, role: string) => {
    try {
        const userRef = doc(db, 'users', email);
        await setDoc(userRef, { email, role }, { merge: true });
        return email;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const addReservation = async (reservation: Omit<Reservation, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'reservations'), reservation);
        return docRef.id;
    } catch (error) {
        console.error('Error adding reservation:', error);
        throw error;
    }
};

export const updateReservation = async (id: string, reservationData: any) => {
    try {
        const reservationRef = doc(db, 'reservations', id);
        await updateDoc(reservationRef, reservationData);
    } catch (error) {
        console.error('Error updating reservation:', error);
        throw error;
    }
};

export const deleteReservation = async (id: string) => {
    try {
        const reservationRef = doc(db, 'reservations', id);
        await deleteDoc(reservationRef);
    } catch (error) {
        console.error('Error deleting reservation:', error);
        throw error;
    }
};

export const getReservationsByMonth = async (year: number, month: number): Promise<Reservation[]> => {
    try {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const q = query(
            collection(db, 'reservations'),
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate))
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                date: (data.date as Timestamp).toDate(),
                name: data.name,
                contact: data.contact,
                numberOfPeople: data.numberOfPeople,
                comment: data.comment
            } as Reservation;
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        throw error;
    }
};

// ... other existing functions ...
