/**
 * Unified API Gateway Client
 * 
 * ALL backend requests go through the centralized gateway at:
 * https://api.hotstart.dev
 * 
 * The gateway routes requests to individual services:
 * - /auth/*      → Auth service (login, register, session management)
 * - /blueprint/* → Blueprint service (project templates)
 * - /ui/*        → UI service
 * - /billing/*   → Billing service
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
}

/**
 * Makes an API request through the gateway
 * @param endpoint - API endpoint path (e.g., '/auth/login')
 * @param options - Request options
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx responses
 */
export async function apiRequest<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	const { method = 'GET', body, headers = {}, credentials = 'include' } = options;

	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		method,
		credentials, // Include credentials for cookie-based auth
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (body && method !== 'GET') {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(url, config);
	
	// Handle empty responses
	const text = await response.text();
	const data = text ? JSON.parse(text) as Record<string, unknown> : {};

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
	 * POST /auth/register
	 */
	register: (email: string, password: string) =>
		api.post<AuthResponse>('/auth/register', { email, password }),

	/**
	 * Login with email and password
	 * POST /auth/login
	 */
	login: (email: string, password: string) =>
		api.post<AuthResponse>('/auth/login', { email, password }),

	/**
	 * Get current authenticated user
	 * GET /auth/me
	 */
	me: () =>
		api.get<AuthResponse>('/auth/me'),

	/**
	 * Logout current user
	 * POST /auth/logout
	 */
	logout: () =>
		api.post<{ success: boolean }>('/auth/logout', {}),
};

// ============================================
// BLUEPRINT SERVICE - /blueprint/*
// ============================================

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
 * All routes proxied through gateway: /blueprint/*
 */
export const blueprintApi = {
	/**
	 * Create a new blueprint
	 * POST /blueprint/create
	 */
	create: (data: { name: string; description?: string; config: Record<string, unknown> }) =>
		api.post<BlueprintResponse>('/blueprint/create', data),

	/**
	 * List all blueprints
	 * GET /blueprint/list
	 */
	list: () =>
		api.get<BlueprintListResponse>('/blueprint/list'),

	/**
	 * Get a specific blueprint by ID
	 * GET /blueprint/:id
	 */
	get: (id: string) =>
		api.get<BlueprintResponse>(`/blueprint/${id}`),

	/**
	 * Update a blueprint
	 * PUT /blueprint/:id
	 */
	update: (id: string, data: Partial<Blueprint>) =>
		api.put<BlueprintResponse>(`/blueprint/${id}`, data),

	/**
	 * Delete a blueprint
	 * DELETE /blueprint/:id
	 */
	delete: (id: string) =>
		api.delete<{ success: boolean }>(`/blueprint/${id}`),
};

// ============================================
// UI SERVICE - /ui/*
// ============================================

/**
 * UI Service API
 * All routes proxied through gateway: /ui/*
 */
export const uiApi = {
	/**
	 * Get UI configuration
	 * GET /ui/config
	 */
	getConfig: () =>
		api.get<{ success: boolean; config: Record<string, unknown> }>('/ui/config'),

	/**
	 * Get theme settings
	 * GET /ui/theme
	 */
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
 * Billing Service API
 * All routes proxied through gateway: /billing/*
 */
export const billingApi = {
	/**
	 * Get available plans
	 * GET /billing/plans
	 */
	getPlans: () =>
		api.get<{ success: boolean; plans: BillingPlan[] }>('/billing/plans'),

	/**
	 * Get current subscription
	 * GET /billing/subscription
	 */
	getSubscription: () =>
		api.get<{ success: boolean; subscription: Subscription | null }>('/billing/subscription'),

	/**
	 * Create checkout session
	 * POST /billing/checkout
	 */
	createCheckout: (planId: string) =>
		api.post<{ success: boolean; checkoutUrl: string }>('/billing/checkout', { planId }),

	/**
	 * Cancel subscription
	 * POST /billing/cancel
	 */
	cancelSubscription: () =>
		api.post<{ success: boolean }>('/billing/cancel', {}),
};
