import { API_BASE_URL, API_ENDPOINTS } from './api-config';

export const convertText = async (requestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.convert}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the raw response text
    const rawData = await response.text();
    
    try {
      // First, try parsing it as a regular JSON
      const data = JSON.parse(rawData);
      
      // If it's a string (double-encoded JSON), parse it again
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Parse error:', error);
      console.log('Raw response:', rawData);
      throw new Error('Failed to parse server response');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
