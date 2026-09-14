import type { UploadResponse, AnalysisResponse } from '../types';

const API_BASE_URL = 'https://airesumematcher-8gg5.onrender.com/api';

export const apiService = {
  uploadResume: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload and parse resume');
    }

    return response.json();
  },

  analyzeMatch: async (resumeText: string, jobDescription: string): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('resumeText', resumeText);
    formData.append('jobDescription', jobDescription);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze match');
    }

    return response.json();
  }
};
