'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi, ApiError } from '@/lib/api';

export default function RegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = (): string | null => {
		if (!email.trim()) {
			return 'Email is required';
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return 'Please enter a valid email address';
		}
		if (!password) {
			return 'Password is required';
		}
		if (password.length < 8) {
			return 'Password must be at least 8 characters long';
		}
		if (password !== confirmPassword) {
			return 'Passwords do not match';
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
			const response = await authApi.register(email, password);
			setSuccess('Account created! Signing you in...');
			
			// Store user data in localStorage (auto-login)
			localStorage.setItem('user', JSON.stringify(response.user));
			
			// Redirect to dashboard
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
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl float" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }} />
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
					<p className="text-muted mt-2 text-sm">Create your account</p>
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
								<Link href="/login" className="link ml-2 font-medium">
									Sign in →
								</Link>
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
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="input-field w-full px-4 py-3 rounded-lg text-sm"
								disabled={isLoading}
								autoComplete="new-password"
							/>
							<p className="text-muted text-xs mt-1.5">
								At least 8 characters
							</p>
						</div>

						{/* Confirm Password Field */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••••"
								className="input-field w-full px-4 py-3 rounded-lg text-sm"
								disabled={isLoading}
								autoComplete="new-password"
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
									Creating account...
								</span>
							) : (
								'Create account'
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

					{/* Sign In Link */}
					<p className="text-center text-sm text-muted">
						Already have an account?{' '}
						<Link href="/login" className="link font-medium">
							Sign in
						</Link>
					</p>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-muted mt-8">
					By creating an account, you agree to our{' '}
					<a href="#" className="link">Terms of Service</a>
					{' '}and{' '}
					<a href="#" className="link">Privacy Policy</a>
				</p>
			</div>
		</div>
	);
}

