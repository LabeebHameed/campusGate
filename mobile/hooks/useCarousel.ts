import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { CarouselItem } from '../types';

interface UseCarouselProps {
  data: CarouselItem[];
  onItemPress?: (item: CarouselItem) => void;
}

export function useCarousel({ data, onItemPress }: UseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<any>(null);

  const handleItemPress = useCallback((item: CarouselItem) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      Alert.alert('College Details', `Viewing details for ${item.title}`);
    }
  }, [onItemPress]);

  const handleImageError = useCallback(() => {
    console.warn('Failed to load carousel image');
  }, []);

  const handleProgressChange = useCallback((progress: number) => {
    setCurrentIndex(Math.round(progress));
  }, []);

  const goToNext = useCallback(() => {
    if (carouselRef.current && data.length > 0) {
      const nextIndex = (currentIndex + 1) % data.length;
      carouselRef.current.scrollTo({ index: nextIndex, animated: true });
    }
  }, [currentIndex, data.length]);

  const goToPrevious = useCallback(() => {
    if (carouselRef.current && data.length > 0) {
      const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
      carouselRef.current.scrollTo({ index: prevIndex, animated: true });
    }
  }, [currentIndex, data.length]);

  const goToIndex = useCallback((index: number) => {
    if (carouselRef.current && index >= 0 && index < data.length) {
      carouselRef.current.scrollTo({ index, animated: true });
    }
  }, [data.length]);

  return {
    currentIndex,
    carouselRef,
    handleItemPress,
    handleImageError,
    handleProgressChange,
    goToNext,
    goToPrevious,
    goToIndex,
  };
} 