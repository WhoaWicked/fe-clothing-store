'use client';
import React, { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

const ProfileContext = createContext();
const fetcher = (url) => axios.get(url).then(res => res.data);

export function ProfileProvider({ children }) {
    const { data: profileData, error: profileError, isLoading: profileIsLoading, mutate: mutateProfile } = useSWR('/api/user/profile', fetcher,
        { onError: (err) => console.error('Error fetching profile data:', err) }
    );
    const value = useMemo(() => ({
        profileData,
        profileError,
        profileIsLoading,
        mutateProfile
    }), [profileData, profileError, profileIsLoading, mutateProfile]);
    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile ต้องใช้ภายใน Profile Provider เท่านั้น');
    }
    return context;
}
