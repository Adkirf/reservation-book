import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

// ... existing code ...
import { doc, setDoc } from 'firebase/firestore';

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
