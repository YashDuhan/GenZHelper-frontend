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
      // Try to parse the response text as JSON
      let data = JSON.parse(rawData);
      
      // If the data still contains JSON strings (like in your case with ```json\n{...}```)
      if (typeof data === 'string') {
        // Remove markdown code block formatting if present
        if (data.startsWith('```json') || data.startsWith('```')) {
          // Extract the JSON part from the markdown code block
          const jsonMatch = data.match(/```(?:json)?\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            data = JSON.parse(jsonMatch[1]);
          } else {
            // Just try parsing the string directly if markdown pattern doesn't match
            data = JSON.parse(data);
          }
        } else {
          // Regular JSON string
          data = JSON.parse(data);
        }
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
