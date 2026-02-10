const API_BASE_URL = 'http://localhost:5000';

export interface PredictionResponse {
  validation: boolean;
  error?: string;
  cdr?: {
    area: number;
    vertical: number;
  };
  prediction?: string;
  probability?: number;
  segmentation?: {
    disc: string;
    cup: string;
    overlay: string;
  };
  gradcam?: string;
}

export const apiService = {
  async predictImage(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
