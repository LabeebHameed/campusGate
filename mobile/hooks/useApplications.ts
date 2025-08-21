import { useState, useCallback } from 'react';
import { useApiClient, applicationApi } from '../utils/api';
import { Application, ApplicationFormData } from '../types';

export const useApplications = () => {
  const api = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyToCourse = useCallback(async (data: ApplicationFormData): Promise<Application | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationApi.applyToCourse(api, data);
      return response.data.application;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to apply to course';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getUserApplications = useCallback(async (): Promise<Application[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationApi.getUserApplications(api);
      return response.data.applications;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch applications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getApplicationById = useCallback(async (applicationId: string): Promise<Application | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationApi.getApplicationById(api, applicationId);
      return response.data.application;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateApplication = useCallback(async (applicationId: string, data: Partial<Application>): Promise<Application | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationApi.updateApplication(api, applicationId, data);
      return response.data.application;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteApplication = useCallback(async (applicationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await applicationApi.deleteApplication(api, applicationId);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    applyToCourse,
    getUserApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
    clearError,
  };
};

