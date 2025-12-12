/**
 * Unified API Gateway Client
 * 
 * ALL backend requests go through the centralized gateway at:
 * https://api.hotstart.dev
 * 
 * Authentication:
 * - JWT tokens are stored in localStorage
 * - Authorization header is automatically included for all requests
 * - Public routes (auth, blueprints) work without authentication
 * 
 * The gateway routes requests to individual services:
 * - /auth/*       → Auth service (login, register, session management)
 * - /blueprints/* → Blueprint service (project templates) - TEMPORARILY PUBLIC
 * - /billing/*    → Billing service (protected)
 * - /user/*       → User service (protected)
 */

// Gateway URL - the ONLY backend entrypoint
const GATEWAY_URL = 'https://api.hotstart.dev';

// For local development, use localhost gateway (if running locally)
const DEV_GATEWAY_URL = 'http://localhost:8787';

function getGatewayUrl(): string {
	// Check for explicit env var first (set at build time)
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}
	
	// In browser on production domain, use production gateway
	if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
		return GATEWAY_URL;
	}
	
	// Default to localhost for development
	return DEV_GATEWAY_URL;
}

const API_BASE_URL = getGatewayUrl();

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = 'hotstart_token';
const USER_KEY = 'hotstart_user';

/**
 * Get the stored JWT token
 */
export function getToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store JWT token
 */
export function setToken(token: string): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove stored token
 */
export function clearToken(): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
}

/**
 * Get stored user data
 */
export function getStoredUser(): AuthUser | null {
	if (typeof window === 'undefined') return null;
	const data = localStorage.getItem(USER_KEY);
	return data ? JSON.parse(data) : null;
}

/**
 * Store user data
 */
export function setStoredUser(user: AuthUser): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
	return !!getToken();
}

// ============================================
// API CLIENT
// ============================================

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
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	headers?: Record<string, string>;
	credentials?: RequestCredentials;
	skipAuth?: boolean; // Skip adding Authorization header
}

/**
 * Makes an API request through the gateway
 * Automatically includes JWT token in Authorization header
 */
export async function apiRequest<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	const { method = 'GET', body, headers = {}, credentials = 'include', skipAuth = false } = options;

	const url = `${API_BASE_URL}${endpoint}`;

	// Build headers with auth token
	const requestHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...headers,
	};

	// Add Authorization header if token exists and not skipped
	if (!skipAuth) {
		const token = getToken();
		if (token) {
			requestHeaders['Authorization'] = `Bearer ${token}`;
		}
	}

	const config: RequestInit = {
		method,
		credentials,
		headers: requestHeaders,
	};

	if (body && method !== 'GET') {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(url, config);
	
	// Handle empty responses
	const text = await response.text();
	const data = text ? JSON.parse(text) as Record<string, unknown> : {};

	// Handle 401 - clear token and potentially redirect
	if (response.status === 401) {
		clearToken();
	}

	if (!response.ok) {
		throw new ApiError(response.status, response.statusText, data);
	}

	return data as T;
}

/**
 * Base API methods for making requests
 */
export const api = {
	get: <T>(endpoint: string, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'GET', headers }),

	post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'POST', body, headers }),

	put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'PUT', body, headers }),

	patch: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'PATCH', body, headers }),

	delete: <T>(endpoint: string, headers?: Record<string, string>) =>
		apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};

// ============================================
// AUTH SERVICE - /auth/*
// ============================================

export interface AuthUser {
	id: string;  // UUID
	email: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	user: AuthUser;
	token?: string; // JWT token returned on login/register
}

export interface AuthError {
	error: string;
}

/**
 * Auth Service API
 * All routes proxied through gateway: /auth/*
 */
export const authApi = {
	/**
	 * Register a new user
	 * Stores token and user data on success
	 */
	register: async (email: string, password: string): Promise<AuthResponse> => {
		const response = await api.post<AuthResponse>('/auth/register', { email, password });
		if (response.token) {
			setToken(response.token);
			setStoredUser(response.user);
		}
		return response;
	},

	/**
	 * Login with email and password
	 * Stores token and user data on success
	 */
	login: async (email: string, password: string): Promise<AuthResponse> => {
		const response = await api.post<AuthResponse>('/auth/login', { email, password });
		if (response.token) {
			setToken(response.token);
			setStoredUser(response.user);
		}
		return response;
	},

	/**
	 * Get current authenticated user
	 */
	me: () => api.get<AuthResponse>('/auth/me'),

	/**
	 * Logout current user
	 * Clears stored token and user data
	 */
	logout: async (): Promise<{ success: boolean }> => {
		try {
			const response = await api.post<{ success: boolean }>('/auth/logout', {});
			return response;
		} finally {
			clearToken();
		}
	},
};

// ============================================
// BLUEPRINT SERVICE - /blueprints/*
// ============================================
// NOTE: Blueprint routes are TEMPORARILY public until app login exists

export interface Blueprint {
	id: string;
	name: string;
	description?: string;
	config: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export interface BlueprintListResponse {
	success: boolean;
	blueprints: Blueprint[];
}

export interface BlueprintResponse {
	success: boolean;
	blueprint: Blueprint;
}

/**
 * Blueprint Service API
 * All routes proxied through gateway: /blueprints/*
 * NOTE: Currently public - will require auth once login is implemented
 */
export const blueprintApi = {
	/**
	 * Create a new blueprint
	 */
	create: (data: { name: string; description?: string; config: Record<string, unknown> }) =>
		api.post<BlueprintResponse>('/blueprints/create', data),

	/**
	 * List all blueprints
	 */
	list: () => api.get<BlueprintListResponse>('/blueprints/list'),

	/**
	 * Get a specific blueprint by ID
	 */
	get: (id: string) => api.get<BlueprintResponse>(`/blueprints/${id}`),

	/**
	 * Update a blueprint
	 */
	update: (id: string, data: Partial<Blueprint>) =>
		api.put<BlueprintResponse>(`/blueprints/${id}`, data),

	/**
	 * Delete a blueprint
	 */
	delete: (id: string) => api.delete<{ success: boolean }>(`/blueprints/${id}`),
};

// ============================================
// UI SERVICE - /ui/*
// ============================================

/**
 * UI Service API (Protected)
 * All routes proxied through gateway: /ui/*
 */
export const uiApi = {
	getConfig: () =>
		api.get<{ success: boolean; config: Record<string, unknown> }>('/ui/config'),

	getTheme: () =>
		api.get<{ success: boolean; theme: Record<string, unknown> }>('/ui/theme'),
};

// ============================================
// BILLING SERVICE - /billing/*
// ============================================

export interface BillingPlan {
	id: string;
	name: string;
	price: number;
	features: string[];
}

export interface Subscription {
	id: string;
	planId: string;
	status: 'active' | 'cancelled' | 'past_due';
	currentPeriodEnd: string;
}

/**
 * Billing Service API (Protected)
 * All routes proxied through gateway: /billing/*
 */
export const billingApi = {
	getPlans: () =>
		api.get<{ success: boolean; plans: BillingPlan[] }>('/billing/plans'),

	getSubscription: () =>
		api.get<{ success: boolean; subscription: Subscription | null }>('/billing/subscription'),

	createCheckout: (planId: string) =>
		api.post<{ success: boolean; checkoutUrl: string }>('/billing/checkout', { planId }),

	cancelSubscription: () =>
		api.post<{ success: boolean }>('/billing/cancel', {}),
};
