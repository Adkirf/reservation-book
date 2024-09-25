'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserRole } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { AuthContextType, UserRole, AppUser } from '@/lib/projectTypes';
import { getDoc, doc } from 'firebase/firestore'; // Assuming you have this import
import { db } from '@/lib/firebase/config'; // Assuming you have this import

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            console.log("Auth state changed. User:", firebaseUser?.email);
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.email!));
                    if (userDoc.exists()) {
                        const userData = userDoc.data() as AppUser;
                        console.log("User data:", userData);
                        setUser(firebaseUser);
                        setRole(userData.role as UserRole);
                        console.log("Fetched user role:", userData.role);
                    } else {
                        console.error("User document does not exist in Firestore");
                        await auth.signOut();
                        setUser(null);
                        setRole(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    await auth.signOut();
                    setUser(null);
                    setRole(null);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        role,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};