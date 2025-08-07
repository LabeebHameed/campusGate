import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://campus-gate.vercel.app/api";
// ! 🔥 localhost api would not work on your actual physical device
// const API_BASE_URL = "http://localhost:5001/api";

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
};

export const notificationApi = {
  createNotification: (api: AxiosInstance, data: { message: string; type?: string }) =>
    api.post("/notifications", data),
  getUserNotifications: (api: AxiosInstance) => api.get("/notifications"),
  markAsRead: (api: AxiosInstance, notificationId: string) =>
    api.patch(`/notifications/${notificationId}/read`),
};

export const documentApi = {
  uploadDocument: (api: AxiosInstance, data: FormData) =>
    api.post("/documents", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDocuments: (api: AxiosInstance) => api.get("/documents"),
  deleteDocument: (api: AxiosInstance, documentId: string) =>
    api.delete(`/documents/${documentId}`),
  verifyDocument: (api: AxiosInstance, documentId: string, data: { verified: boolean; notes?: string }) =>
    api.patch(`/documents/${documentId}/verify`, data),
};

export const applicationApi = {
  applyToCourse: (api: AxiosInstance, data: { courseId: string; documents?: string[]; personalStatement?: string }) =>
    api.post("/applications", data),
  getUserApplications: (api: AxiosInstance) => api.get("/applications"),
  getApplicationById: (api: AxiosInstance, applicationId: string) =>
    api.get(`/applications/${applicationId}`),
  updateApplication: (api: AxiosInstance, applicationId: string, data: any) =>
    api.patch(`/applications/${applicationId}`, data),
  deleteApplication: (api: AxiosInstance, applicationId: string) =>
    api.delete(`/applications/${applicationId}`),
};

export const collegeApi = {
  getAllColleges: (api: AxiosInstance) => api.get("/colleges"),
  getCollegeById: (api: AxiosInstance, collegeId: string) =>
    api.get(`/colleges/${collegeId}`),
  createCollege: (api: AxiosInstance, data: {
    name: string;
    description?: string;
    location?: string;
    website?: string;
    contactEmail?: string;
    contactPhone?: string;
  }) => api.post("/colleges", data),
  updateCollege: (api: AxiosInstance, collegeId: string, data: any) =>
    api.put(`/colleges/${collegeId}`, data),
  deleteCollege: (api: AxiosInstance, collegeId: string) =>
    api.delete(`/colleges/${collegeId}`),
};

export const courseApi = {
  getAllCourses: (api: AxiosInstance) => api.get("/courses"),
  getCourseById: (api: AxiosInstance, courseId: string) =>
    api.get(`/courses/${courseId}`),
  createCourse: (api: AxiosInstance, data: {
    title: string;
    description?: string;
    collegeId: string;
    duration?: string;
    fees?: number;
    eligibility?: string;
    applicationDeadline?: string;
  }) => api.post("/courses", data),
  updateCourse: (api: AxiosInstance, courseId: string, data: any) =>
    api.put(`/courses/${courseId}`, data),
  deleteCourse: (api: AxiosInstance, courseId: string) =>
    api.delete(`/courses/${courseId}`),
};
