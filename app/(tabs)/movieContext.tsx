// Create a new file: contexts/MovieContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchMovies, fetchMovieDetails } from '@/services/api';
import { getTrendingMovies } from '@/services/appwrite';

interface MovieContextType {
    trendingMovies: any[];
    latestMovies: any[];
    savedMovies: any[];
    searchResults: any[];
    isLoading: boolean;
    error: Error | null;
    searchMovies: (query: string) => Promise<void>;
    getMovieDetails: (id: string) => Promise<any>;
    saveMovie: (movie: any) => void;
    removeSavedMovie: (id: string) => void;
    refreshData: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
    const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
    const [latestMovies, setLatestMovies] = useState<any[]>([]);
    const [savedMovies, setSavedMovies] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [trending, latest] = await Promise.all([
                getTrendingMovies(),
                fetchMovies({ query: "" })
            ]);
            setTrendingMovies(trending ?? []);
            setLatestMovies(latest);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    const searchMovies = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const results = await fetchMovies({ query });
            setSearchResults(results);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Search failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const getMovieDetails = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            return await fetchMovieDetails(id);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch movie details'));
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const saveMovie = (movie: any) => {
        setSavedMovies(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === movie.id)) return prev;
            return [...prev, movie];
        });
        // Persist to AsyncStorage, can be implemented later
    };

    const removeSavedMovie = (id: string) => {
        setSavedMovies(prev => prev.filter(movie => movie.id !== id));
        // Update AsyncStorage as well
    };

    const refreshData = async () => {
        await loadInitialData();
    };

    useEffect(() => {
        loadInitialData();
        // Load saved movies from AsyncStorage here if needed
    }, []);

    return (
        <MovieContext.Provider value={{
            trendingMovies,
            latestMovies,
            savedMovies,
            searchResults,
            isLoading,
            error,
            searchMovies,
            getMovieDetails,
            saveMovie,
            removeSavedMovie,
            refreshData
        }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovies = () => {
    const context = useContext(MovieContext);
    if (context === undefined) {
        throw new Error('useMovies must be used within a MovieProvider');
    }
    return context;
};