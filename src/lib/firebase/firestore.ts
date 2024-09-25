import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './config';

// ... existing code ...

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

// ... existing code ...

export const addReservation = async (reservationData: any) => {
    try {
        const docRef = await addDoc(collection(db, 'reservations'), reservationData);
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

// ... existing code ...
