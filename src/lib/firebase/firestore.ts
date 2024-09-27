import { getDoc, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { app } from './config'; // Assuming you have a Firebase app instance
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { dbItem, Month, Reservation, Task, AppUser, UserRole } from '../projectTypes';

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
 * @param id - The ID of the reservation to update
 * @param reservationData - The updated reservation data
 * @throws Error if the operation fails
 */
export const updateReservation = async (id: string, reservationData: any) => {
    try {
        const reservationRef = doc(db, 'reservations', id);
        await updateDoc(reservationRef, reservationData);
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

export const convertFirestoreTimestamps = (item: any): dbItem => ({
    ...item,
    dateStart: item.dateStart instanceof Timestamp ? item.dateStart.toDate() : item.dateStart,
    dateEnd: item.dateEnd instanceof Timestamp ? item.dateEnd.toDate() : item.dateEnd,
});

export const fetchItemsForMonth = async (month: Month, year: number): Promise<{ reservations: Reservation[], tasks: Task[] }> => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const startOfMonth = new Date(year, monthIndex, 1);
    const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    console.log('Fetching items for:', { month, year, startOfMonth, endOfMonth });

    const itemsQuery = query(
        collection(db, 'items'),
        where('dateStart', '>=', Timestamp.fromDate(startOfMonth)),
        where('dateStart', '<=', Timestamp.fromDate(endOfMonth))
    );

    try {
        const itemsSnapshot = await getDocs(itemsQuery);

        console.log('Query returned:', itemsSnapshot.size, 'documents');

        const reservations: Reservation[] = [];
        const tasks: Task[] = [];

        itemsSnapshot.forEach((doc) => {
            console.log('Document data:', doc.data());
            const data = convertFirestoreTimestamps(doc.data() as dbItem);
            if ('numberOfPeople' in data) {
                reservations.push(data as Reservation);
            } else if ('assignedTo' in data) {
                tasks.push(data as Task);
            }
        });

        console.log('Processed items:', { reservations, tasks });

        return { reservations, tasks };
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

export const addItem = async (item: Omit<dbItem, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'items'), {
            ...item,
            dateStart: Timestamp.fromDate(item.dateStart),
            dateEnd: Timestamp.fromDate(item.dateEnd),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};

