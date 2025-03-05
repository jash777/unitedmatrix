// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://183.83.218.245:5005';

export const API_ENDPOINTS = {
    PDF_GENERATOR: `${API_BASE_URL}/api/pdf-generator`,
    PDF_LOGS: `${API_BASE_URL}/api/pdf-logs`,
    ACCOUNTS: `${API_BASE_URL}/api/accounts`,
};

export default API_ENDPOINTS; 