'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi, ApiError } from '@/lib/api';

// ============================================
// SHARED LOGIN PAGE - Web + Desktop App
// ============================================
// This page handles login for both:
// - Web users: Normal browser session, redirect to dashboard
// - App users: Generate auth code, redirect to deep link
//
// Query Parameters:
// - client: 'web' | 'app' (defaults to 'web')
// - redirect_uri: Where to redirect after login
//
// App Flow:
// 1. App opens: hotstart.dev/login?client=app&redirect_uri=hotstart://auth/callback
// 2. User enters credentials
// 3. On success, generates auth code via API
// 4. Redirects to: hotstart://auth/callback?code=AUTH_CODE
//
// Web Flow:
// 1. User visits: hotstart.dev/login or hotstart.dev/login?client=web&redirect_uri=/app
// 2. User enters credentials  
// 3. On success, stores JWT in localStorage
// 4. Redirects to: /dashboard or specified redirect_uri
// ============================================

// Allowed redirect URIs for security
const ALLOWED_REDIRECT_PATTERNS = [
	/^hotstart:\/\/auth\/callback$/,  // Desktop app deep link
	/^https:\/\/hotstart\.dev(\/.*)?$/, // Production web
	/^https:\/\/www\.hotstart\.dev(\/.*)?$/, // Production web with www
	/^\/[\w/-]*$/, // Relative paths (e.g., /dashboard, /app)
];

function isValidRedirectUri(uri: string): boolean {
	return ALLOWED_REDIRECT_PATTERNS.some(pattern => pattern.test(uri));
}

// Loading fallback for Suspense
function LoginFormSkeleton() {
	return (
		<div className="gradient-bg min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						<span className="text-primary">Hot</span>
						<span className="text-foreground">start</span>
					</h1>
					<p className="text-muted mt-2 text-sm">Loading...</p>
				</div>
				<div className="glass-card rounded-2xl p-8 animate-pulse">
					<div className="space-y-5">
						<div className="h-12 bg-secondary/50 rounded-lg" />
						<div className="h-12 bg-secondary/50 rounded-lg" />
						<div className="h-12 bg-primary/20 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}

// Main login form component that uses useSearchParams
function LoginForm() {
	const searchParams = useSearchParams();
	
	// Parse query parameters
	const client = searchParams.get('client') || 'web';
	const redirectUri = searchParams.get('redirect_uri') || '/dashboard';
	const isAppLogin = client === 'app';
	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [redirectError, setRedirectError] = useState('');

	// Validate redirect_uri on mount
	useEffect(() => {
		if (!isValidRedirectUri(redirectUri)) {
			setRedirectError('Invalid redirect destination');
		}
	}, [redirectUri]);

	const validateForm = (): string | null => {
		if (!email.trim()) {
			return 'Email is required';
		}
		if (!password) {
			return 'Password is required';
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		// Block submission if redirect_uri is invalid
		if (redirectError) {
			setError('Invalid redirect destination. Please close this page and try again.');
			return;
		}

		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsLoading(true);

		try {
			if (isAppLogin) {
				// ============================================
				// APP LOGIN FLOW
				// ============================================
				// 1. Authenticate and get auth code (not JWT)
				// 2. Redirect to app deep link with code
				// 3. App exchanges code for JWT via POST /auth/token
				// ============================================
				const response = await authApi.loginForApp(email, password);
				
				if (response.code) {
					setSuccess('Authentication successful!');
					// Redirect to app with auth code
					setTimeout(() => {
						window.location.href = `${redirectUri}?code=${encodeURIComponent(response.code)}`;
					}, 500);
				} else {
					throw new Error('No auth code received');
				}
			} else {
				// ============================================
				// WEB LOGIN FLOW
				// ============================================
				// 1. Authenticate and get JWT
				// 2. Store JWT in localStorage
				// 3. Redirect to web destination
				// ============================================
				const response = await authApi.login(email, password);
				setSuccess(response.message);
				
				// Token and user data are automatically stored by authApi.login()
				// Redirect after a brief delay
				setTimeout(() => {
					window.location.href = redirectUri;
				}, 1000);
			}
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError('An unexpected error occurred. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Show success screen for app login redirect
	if (success && isAppLogin) {
		return (
			<div className="gradient-bg min-h-screen flex items-center justify-center p-4">
				{/* Decorative elements */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl float" />
					<div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl float" style={{ animationDelay: '-2s' }} />
				</div>

				<div className="w-full max-w-md relative z-10">
					{/* Logo/Brand */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold tracking-tight">
							<span className="text-primary">Hot</span>
							<span className="text-foreground">start</span>
						</h1>
					</div>

					{/* Success Card */}
					<div className="glass-card rounded-2xl p-8 text-center">
						{/* Success Icon */}
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
							<svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						
						<h2 className="text-xl font-semibold text-foreground mb-2">
							Authentication Successful
						</h2>
						<p className="text-muted text-sm mb-6">
							Redirecting you back to the app...
						</p>
						
						{/* Loading spinner */}
						<div className="flex justify-center">
							<svg className="spinner w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
						</div>
					</div>

					{/* Security note */}
					<div className="flex items-center justify-center gap-2 mt-8 text-xs text-muted">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
						<span>You can close this window</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="gradient-bg min-h-screen flex items-center justify-center p-4">
			{/* Decorative elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl float" />
				<div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl float" style={{ animationDelay: '-2s' }} />
			</div>

			<div className="w-full max-w-md relative z-10">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<Link href="/" className="inline-block">
						<h1 className="text-3xl font-bold tracking-tight">
							<span className="text-primary">Hot</span>
							<span className="text-foreground">start</span>
						</h1>
					</Link>
					<p className="text-muted mt-2 text-sm">
						{isAppLogin ? 'Sign in to continue to the app' : 'Welcome back'}
					</p>
				</div>

				{/* Card */}
				<div className="glass-card rounded-2xl p-8">
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Error Alert */}
						{error && (
							<div className="alert-error rounded-lg px-4 py-3 text-sm">
								{error}
							</div>
						)}

						{/* Success Alert */}
						{success && (
							<div className="alert-success rounded-lg px-4 py-3 text-sm">
								{success}
							</div>
						)}

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="input-field w-full px-4 py-3 rounded-lg text-sm"
								disabled={isLoading}
								autoComplete="email"
							/>
						</div>

						{/* Password Field */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<label htmlFor="password" className="block text-sm font-medium text-foreground">
									Password
								</label>
								<a href="#" className="text-xs link">
									Forgot password?
								</a>
							</div>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="input-field w-full px-4 py-3 rounded-lg text-sm"
								disabled={isLoading}
								autoComplete="current-password"
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="btn-primary w-full py-3 rounded-lg text-sm mt-6"
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
									</svg>
									Signing in...
								</span>
							) : (
								'Sign in'
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-secondary px-3 text-muted">or</span>
						</div>
					</div>

					{/* Sign Up Link */}
					<p className="text-center text-sm text-muted">
						Don&apos;t have an account?{' '}
						<Link href="/register" className="link font-medium">
							Create one
						</Link>
					</p>
				</div>

				{/* Security note */}
				<div className="flex items-center justify-center gap-2 mt-8 text-xs text-muted">
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
					<span>Secured with industry-standard encryption</span>
				</div>
			</div>
		</div>
	);
}

// Page component with Suspense boundary for useSearchParams
export default function LoginPage() {
	return (
		<Suspense fallback={<LoginFormSkeleton />}>
			<LoginForm />
		</Suspense>
	);
}
