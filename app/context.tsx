import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import GitHubAPI from '../utils/githubAccessor';

interface MyProviderProps {
    children: ReactNode;
}

export const MyContext = React.createContext(new GitHubAPI());

export const MyProvider = ({ children }: MyProviderProps) => {
    // Define the data or state you want to share
    const context = useContext(MyContext);

    const initContext = async () => {
        const username = await AsyncStorage.getItem('USERNAME');
        const repo = await AsyncStorage.getItem('REPO-NAME');
        const token = await AsyncStorage.getItem('TOKEN');
        if (username && repo && token)
            context.init(username, token, repo);
    }
    useEffect(() => {
        initContext();
    }, [])

    return (
        <MyContext.Provider value={context}>
            {children}
        </MyContext.Provider>
    );
};
