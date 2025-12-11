/**
 * Unified API request helper
 * Handles all communication with the backend Worker
 */

// Production API URL - used when NEXT_PUBLIC_API_URL is not set at build time
const PRODUCTION_API_URL = 'https://hs-web-api.milannair99.workers.dev';

function getApiBaseUrl(): string {
	// Check for explicit env var first (set at build time)
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}
	
	// In browser on production domain, use production API
	if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
		return PRODUCTION_API_URL;
	}
	
	// Default to localhost for development
	return 'http://localhost:8787';
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		public data: Record<string, unknown>
	) {
		super(data.error as string || `API Error: ${status} ${statusText}`);
		this.name = 'ApiError';
	}
}

/**
 * Type-safe API request options
 */
interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
	headers?: Record<string, string>;
}

/**
 * Makes an API request to the backend
 * @param endpoint - API endpoint path (e.g., '/api/register')
 * @param options - Request options
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx responses
 */
export async function apiRequest<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	const { method = 'GET', body, headers = {} } = options;

	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (body && method !== 'GET') {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(url, config);
	const data = await response.json() as Record<string, unknown>;

	if (!response.ok) {
		throw new ApiError(response.status, response.statusText, data);
	}

	return data as T;
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
	get: <T>(endpoint: string, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'GET', headers }),

	post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'POST', body, headers }),

	put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'PUT', body, headers }),

	delete: <T>(endpoint: string, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};

/**
 * Auth-specific API types
 */
export interface AuthResponse {
	success: boolean;
	message: string;
	user: {
		id: number;
		email: string;
	};
}

export interface AuthError {
	error: string;
}

/**
 * Auth API endpoints
 */
export const authApi = {
	register: (email: string, password: string) =>
		api.post<AuthResponse>('/api/register', { email, password }),

	login: (email: string, password: string) =>
		api.post<AuthResponse>('/api/login', { email, password }),
};

