import axios from "axios";

// Constants for security
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const MAX_RETRIES = 2;

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest", // Helps prevent CSRF attacks
    },
    withCredentials: true, // Required for handling cookies
    timeout: 10000, // 10 seconds timeout
});    


// Function to get secure token
const getSecureToken = () => {
    try {
        return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error accessing storage:', error);
        return null;
    }
};

// Request interceptor with enhanced security
axiosInstance.interceptors.request.use(
    (config) => {
        // Add security headers
        config.headers = {
            ...config.headers,
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
        };

        const token = getSecureToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Add request timestamp to prevent replay attacks
        config.headers["X-Request-Timestamp"] = Date.now();

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with enhanced security and error handling
axiosInstance.interceptors.response.use(
    (response) => {
        // Validate response
        if (!response.data) {
            throw new Error('Empty response received');
        }

        // Check for security headers
        const securityHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'Strict-Transport-Security'
        ];

        securityHeaders.forEach(header => {
            if (!response.headers[header.toLowerCase()]) {
                console.warn(`Security header missing: ${header}`);
            }
        });

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle authentication errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY) || 
                                   localStorage.getItem(REFRESH_TOKEN_KEY);
                
                if (refreshToken) {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh-token`,
                        { refreshToken }
                    );

                    if (response.data.token) {
                        // Store new tokens
                        sessionStorage.setItem(TOKEN_KEY, response.data.token);
                        if (response.data.refreshToken) {
                            sessionStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
                        }

                        // Retry original request
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                        return axiosInstance(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }

            // Clear tokens and redirect to login
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            window.location.href = "/login";
        }

        // Handle other errors
        if (error.response?.status === 403) {
            window.location.href = "/unauthorized";
        }

        return Promise.reject(error);
    }
);

// Add request retry functionality
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const { config } = error;
        
        if (!config || !config.retry) {
            config.retry = 0;
        }

        if (config.retry >= MAX_RETRIES) {
            return Promise.reject(error);
        }

        config.retry += 1;
        const delayRetry = new Promise(resolve => {
            setTimeout(resolve, 1000 * config.retry);
        });

        await delayRetry;
        return axiosInstance(config);
    }
);

export default axiosInstance;