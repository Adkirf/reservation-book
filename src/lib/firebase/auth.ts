import { auth } from './config';
import { db } from './firestore';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AppUser } from '../projectTypes';

/**
 * Handles Google Sign-In process
 * Checks if the user exists in the database before allowing sign-in
 * @throws Error if user is not authorized or if sign-in fails
 */
export const signInWithGoogle = async (): Promise<void> => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;

        // Verify user's existence in the database
        const userDoc = await getDoc(doc(db, 'users', googleUser.email!));

        if (!userDoc.exists()) {
            // Prevent unauthorized access by signing out and throwing an error
            await auth.signOut();
            throw new Error('User not authorized. Please contact an administrator.');
        }

        // User exists in the database, authentication can proceed
    } catch (error) {
        console.error('Error signing in with Google:', error);
        //throw error; // Re-throw for handling in the UI layer
    }
};

/**
 * Signs out the current user
 * Catches and logs any errors during the sign-out process
 */
export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out', error);
        // Note: Error is not re-thrown to prevent UI disruption
    }
};

/**
 * Retrieves the role of a user from Firestore
 * @param uid - The user's unique identifier
 * @returns The user's role or null if not found
 */
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
        return null; // Return null instead of throwing to prevent UI disruption
    }
};

/**
 * Signs in a user with email and password
 * @param email - The user's email address
 * @param password - The user's password
 * @returns The signed-in user object
 * @throws Error if sign-in fails
 */
export const signIn = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Error signing in', error);
        throw error; // Re-throw for handling in the UI layer
    }
};

