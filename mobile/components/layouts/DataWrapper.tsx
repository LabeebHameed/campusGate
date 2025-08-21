import React, { useState, useEffect } from 'react';
import { AppLoadingScreen } from '../common/AppLoadingScreen';
import { waitForAllData } from '../../data';

interface DataWrapperProps {
  children: React.ReactNode;
}

export function DataWrapper({ children }: DataWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Wait for all data to load
        await waitForAllData();
        
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading data:', error);
        // Even if there's an error, show the app (it will handle empty data gracefully)
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <AppLoadingScreen />;
  }

  return <>{children}</>;
} 