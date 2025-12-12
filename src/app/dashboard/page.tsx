'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredUser, authApi, isAuthenticated, type AuthUser } from '@/lib/api';

export default function DashboardPage() {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		// Check authentication and get user data
		if (!isAuthenticated()) {
			window.location.href = '/login';
			return;
		}
		
		const storedUser = getStoredUser();
		if (storedUser) {
			setUser(storedUser);
		}
	}, []);

	const handleLogout = async () => {
		await authApi.logout();
		window.location.href = '/login';
	};

	return (
		<div className="gradient-bg min-h-screen">
			{/* Header */}
			<header className="border-b border-border/50 bg-secondary/30 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<Link href="/" className="text-xl font-bold tracking-tight">
						<span className="text-primary">Hot</span>
						<span className="text-foreground">start</span>
					</Link>
					<div className="flex items-center gap-4">
						{user && (
							<span className="text-sm text-muted">
								{user.email}
							</span>
						)}
						<button
							onClick={handleLogout}
							className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
						>
							Sign out
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12">
				{/* Welcome Section */}
				<div className="mb-12">
					<h1 className="text-3xl font-bold mb-2">
						Welcome back{user ? `, ${user.email.split('@')[0]}` : ''}! 👋
					</h1>
					<p className="text-muted">
						Here's what's happening with your account today.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<div className="glass-card rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-muted">Projects</span>
							<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
								</svg>
							</div>
						</div>
						<p className="text-3xl font-bold">0</p>
						<p className="text-xs text-muted mt-1">Create your first project</p>
					</div>

					<div className="glass-card rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-muted">API Calls</span>
							<div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
								<svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
						</div>
						<p className="text-3xl font-bold">0</p>
						<p className="text-xs text-muted mt-1">This month</p>
					</div>

					<div className="glass-card rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-muted">Status</span>
							<div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
								<svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
						<p className="text-3xl font-bold text-success">Active</p>
						<p className="text-xs text-muted mt-1">All systems operational</p>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mb-12">
					<h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<button className="glass-card rounded-xl p-5 text-left hover:border-primary/30 transition-colors group">
							<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
								<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</div>
							<h3 className="font-medium mb-1">New Project</h3>
							<p className="text-xs text-muted">Create a new project</p>
						</button>

						<button className="glass-card rounded-xl p-5 text-left hover:border-primary/30 transition-colors group">
							<div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
								<svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
								</svg>
							</div>
							<h3 className="font-medium mb-1">API Keys</h3>
							<p className="text-xs text-muted">Manage your API keys</p>
						</button>

						<button className="glass-card rounded-xl p-5 text-left hover:border-primary/30 transition-colors group">
							<div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3 group-hover:bg-warning/20 transition-colors">
								<svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<h3 className="font-medium mb-1">Settings</h3>
							<p className="text-xs text-muted">Account settings</p>
						</button>

						<button className="glass-card rounded-xl p-5 text-left hover:border-primary/30 transition-colors group">
							<div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
								<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="font-medium mb-1">Documentation</h3>
							<p className="text-xs text-muted">Read the docs</p>
						</button>
					</div>
				</div>

				{/* Recent Activity */}
				<div>
					<h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
					<div className="glass-card rounded-xl p-8 text-center">
						<div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 className="font-medium mb-2">No recent activity</h3>
						<p className="text-sm text-muted">
							Your recent actions will appear here once you start using the platform.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}


