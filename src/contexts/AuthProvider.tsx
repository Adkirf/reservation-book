'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUser } from '@/lib/firebase/firestore';
import { useRouter } from 'next/navigation';
import { UserRole, AppUser, UserSettings } from '@/lib/projectTypes';
import defaultSettings from '../../public/locales/defaultSettings.json';
import { getTranslation } from '@/lib/utils';

// Create a context for authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    settings: UserSettings;
    t: (key: string) => string;
}

/**
 * Custom hook to access the auth context
 * Throws an error if used outside of AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * AuthProvider: Manages authentication state and user roles
 * Provides auth context to child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<AppUser | null>(null)

    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(user?.settings?.defaultLanguages || defaultSettings.defaultLanguages);

    const t = (key: string) => getTranslation(key, language);

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            console.log("Auth state changed. User:", firebaseUser?.email);
            if (firebaseUser) {
                try {
                    const userData = await getUser(firebaseUser.email!);
                    if (userData) {
                        setUser(userData);
                        console.log("Fetched user role:", userData.role);
                    } else {
                        // Handle case where user exists in Firebase Auth but not in Firestore
                        console.error("User document does not exist in Firestore");
                        await auth.signOut();
                        setUser(null);
                    }
                } catch (error) {
                    // Handle errors in fetching user data
                    console.error("Error fetching user data:", error);
                    await auth.signOut();
                    setUser(null);
                }
            } else {
                // Reset state when user is not authenticated
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Prepare context value
    const value = {
        user,
        loading,
        settings: user?.settings || defaultSettings,
        t,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};