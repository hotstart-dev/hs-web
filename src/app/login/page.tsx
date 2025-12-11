'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi, ApiError } from '@/lib/api';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);

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

		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsLoading(true);

		try {
			const response = await authApi.login(email, password);
			setSuccess(response.message);
			
			// Store user data in localStorage
			localStorage.setItem('user', JSON.stringify(response.user));
			
			// Redirect to dashboard after a brief delay
			setTimeout(() => {
				window.location.href = '/dashboard';
			}, 1000);
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
					<p className="text-muted mt-2 text-sm">Welcome back</p>
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
								<span className="ml-2 opacity-75">Redirecting...</span>
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

