import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colleges, courseDetails as courses } from '../data';

export interface FavoriteItem {
  id: string;
  type: 'college' | 'course';
  name: string;
  subtitle: string;
  image: string;
  rating: string;
  location?: string;
  duration?: string;
  feeRange?: string;
  addedAt: number;
}

const FAVORITES_STORAGE_KEY = 'campus_gate_favorites';

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (id: string, type: 'college' | 'course') => Promise<boolean>;
  removeFromFavorites: (id: string, type: 'college' | 'course') => Promise<boolean>;
  isFavorite: (id: string, type: 'college' | 'course') => boolean;
  toggleFavorite: (id: string, type: 'college' | 'course') => Promise<boolean>;
  getFavoritesByType: (type: 'college' | 'course') => FavoriteItem[];
  clearAllFavorites: () => Promise<void>;
  favoritesCount: number;
  collegesCount: number;
  coursesCount: number;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setFavorites(parsed);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const saveFavorites = useCallback(async (newFavorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  const addToFavorites = useCallback(async (id: string, type: 'college' | 'course') => {
    const exists = favorites.some(fav => fav.id === id && fav.type === type);
    if (exists) return false;

    let newFavorite: FavoriteItem | null = null;

    if (type === 'college') {
      const college = (colleges as any)[id];
      if (college) {
        newFavorite = {
          id: college.id,
          type: 'college',
          name: college.name,
          subtitle: college.category,
          image: college.image,
          rating: college.rating,
          location: `${college.district}, ${college.state}`,
          feeRange: college.feeRange,
          addedAt: Date.now(),
        };
      }
    } else if (type === 'course') {
      const course = (courses as any)[id];
      if (course) {
        newFavorite = {
          id: course.id,
          type: 'course',
          name: course.title,
          subtitle: course.subtitle,
          image: 'https://via.placeholder.com/150',
          rating: '4.5/5',
          duration: course.duration,
          addedAt: Date.now(),
        };
      }
    }

    if (!newFavorite) return false;

    const newFavorites = [newFavorite, ...favorites];
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
    return true;
  }, [favorites, saveFavorites]);

  const removeFromFavorites = useCallback(async (id: string, type: 'college' | 'course') => {
    const newFavorites = favorites.filter(fav => !(fav.id === id && fav.type === type));
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
    return true;
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((id: string, type: 'college' | 'course') => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  }, [favorites]);

  const toggleFavorite = useCallback(async (id: string, type: 'college' | 'course') => {
    if (isFavorite(id, type)) {
      return await removeFromFavorites(id, type);
    }
    return await addToFavorites(id, type);
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const getFavoritesByType = useCallback((type: 'college' | 'course') => {
    return favorites.filter(fav => fav.type === type);
  }, [favorites]);

  const clearAllFavorites = useCallback(async () => {
    setFavorites([]);
    await saveFavorites([]);
  }, [saveFavorites]);

  const value: FavoritesContextValue = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearAllFavorites,
    favoritesCount: favorites.length,
    collegesCount: favorites.filter(f => f.type === 'college').length,
    coursesCount: favorites.filter(f => f.type === 'course').length,
  };
  return React.createElement(
    FavoritesContext.Provider,
    { value },
    children
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
} 