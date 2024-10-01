import { getDoc, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { app } from './config'; // Assuming you have a Firebase app instance
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Month, Reservation, AppUser, UserRole } from '../projectTypes';

// Initialize Firestore with persistent cache
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({})
    })
});

// Use db for all Firestore operations

/**
 * Fetches a user from Firestore by email
 * @param email - The email of the user to fetch
 * @returns The user data or null if not found
 * @throws Error if the operation fails
 */
export const getUser = async (email: string): Promise<AppUser | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', email));
        if (userDoc.exists()) {
            return userDoc.data() as AppUser;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};


/**
 * Adds a new user to the Firestore database or updates an existing one
 * @param email - The user's email address (used as the document ID)
 * @param role - The user's role in the system
 * @returns The added/updated user data
 * @throws Error if the operation fails
 */
export const addUser = async (email: string, role: UserRole, name: string): Promise<AppUser | null> => {
    try {
        const userRef = doc(db, 'users', email);
        const userData: AppUser = { email, role, name };
        // Use setDoc with merge: true to update existing users or create new ones
        await setDoc(userRef, userData, { merge: true });
        return userData;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; // Re-throw for handling in the UI layer
    }
};

/**
 * Adds a new reservation to the Firestore database
 * @param reservation - The reservation object without an ID
 * @returns The ID of the newly created reservation
 * @throws Error if the operation fails
 */
export const addReservation = async (reservation: Omit<Reservation, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'reservations'), reservation);
        return docRef.id;
    } catch (error) {
        console.error('Error adding reservation:', error);
        throw error; // Re-throw for handling in the UI layer
    }
};

/**
 * Updates an existing reservation in the Firestore database
 * @param reservation - The updated reservation data, including the id
 * @throws Error if the operation fails
 */
export const updateReservation = async (reservation: Reservation) => {
    try {
        const { id, ...reservationData } = reservation;
        const reservationRef = doc(db, 'reservations', id);
        await updateDoc(reservationRef, {
            ...reservationData,
            dateStart: Timestamp.fromDate(reservationData.dateStart),
            dateEnd: Timestamp.fromDate(reservationData.dateEnd),
        });
    } catch (error) {
        console.error('Error updating reservation:', error);
        throw error; // Re-throw for handling in the UI layer
    }
};

/**
 * Deletes a reservation from the Firestore database
 * @param id - The ID of the reservation to delete
 * @throws Error if the operation fails
 */
export const deleteReservation = async (id: string) => {
    try {
        const reservationRef = doc(db, 'reservations', id);
        await deleteDoc(reservationRef);
    } catch (error) {
        console.error('Error deleting reservation:', error);
        throw error; // Re-throw for handling in the UI layer
    }
};



/**
 * Fetches all reservations from the Firestore database
 * @returns An array of Reservation objects
 * @throws Error if the operation fails
 */
export const getReservations = async (): Promise<Reservation[]> => {
    try {
        const reservationsQuery = query(collection(db, 'reservations'));
        const reservationsSnapshot = await getDocs(reservationsQuery);

        const reservations: Reservation[] = [];
        reservationsSnapshot.forEach((doc) => {
            const data = doc.data();
            reservations.push({
                id: doc.id,
                ...data,
                dateStart: data.dateStart.toDate(),
                dateEnd: data.dateEnd.toDate(),
            } as Reservation);
        });

        console.log('Fetched reservations:', reservations);
        return reservations;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        throw error;
    }
};



/**
 * Fetches a single reservation from Firestore by its ID
 * @param id - The ID of the reservation to fetch
 * @returns The Reservation object or null if not found
 * @throws Error if the operation fails
 */
export const getReservationById = async (id: string): Promise<Reservation | null> => {
    try {
        const reservationRef = doc(db, 'reservations', id);
        const reservationSnap = await getDoc(reservationRef);

        if (reservationSnap.exists()) {
            const data = reservationSnap.data();
            return {
                id: reservationSnap.id,
                ...data,
                dateStart: data.dateStart.toDate(),
                dateEnd: data.dateEnd.toDate(),
            } as Reservation;
        }

        return null;
    } catch (error) {
        console.error('Error fetching reservation by ID:', error);
        throw error;
    }
};


