import { auth, db } from './config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AppUser } from '../projectTypes';

export const signInWithGoogle = async (): Promise<void> => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;

        // Check if the user exists in the database
        const userDoc = await getDoc(doc(db, 'users', googleUser.email!));
        if (!userDoc.exists()) {
            // If the user doesn't exist in the database, sign them out
            await auth.signOut();
            throw new Error('User not authorized. Please contact an administrator.');
        }

        // User exists in the database, authentication can proceed
        // The actual user data will be fetched in the AuthProvider
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out', error);
    }
};

// Add this new function to get the user's role
export const getUserRole = async (uid: string) => {
    try {
        console.log("Getting user role for UID:", uid);
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const role = userSnap.data().role;
            console.log("User role:", role);
            return role;
        }
        console.log("User document does not exist");
        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
};

// Modify the signIn function to return the user
export const signIn = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Error signing in', error);
        throw error;
    }
};

