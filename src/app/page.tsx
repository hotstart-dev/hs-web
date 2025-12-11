import Link from 'next/link';

export default function Home() {
	return (
		<div className="gradient-bg min-h-screen flex flex-col">
			{/* Decorative background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[120px]" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
				<div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[80px]" />
			</div>

			{/* Header */}
			<header className="relative z-10 flex items-center justify-between p-6 lg:px-12">
				<h1 className="text-2xl font-bold tracking-tight">
					<span className="text-primary">Hot</span>
					<span className="text-foreground">start</span>
				</h1>
				<nav className="flex items-center gap-4">
					<Link
						href="/login"
						className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2"
					>
						Sign in
					</Link>
					<Link
						href="/register"
						className="btn-primary text-sm px-5 py-2.5 rounded-lg"
					>
						Get started
					</Link>
				</nav>
			</header>

			{/* Hero */}
			<main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
				<div className="max-w-3xl mx-auto">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
						</span>
						Now in beta
					</div>

					{/* Headline */}
					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
						Build faster with
						<br />
						<span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
							modern tooling
						</span>
					</h2>

					{/* Subheadline */}
					<p className="text-lg sm:text-xl text-muted max-w-xl mx-auto mb-10 leading-relaxed">
						A production-ready starter with Next.js, Cloudflare Workers, D1 database, and secure authentication built-in.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							href="/register"
							className="btn-primary text-base px-8 py-3.5 rounded-xl w-full sm:w-auto"
						>
							Start building free
						</Link>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors px-6 py-3.5 rounded-xl border border-border hover:border-muted/50 w-full sm:w-auto"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
							</svg>
							View on GitHub
						</a>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-24">
					<div className="glass-card rounded-xl p-6 text-left">
						<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
							<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<h3 className="font-semibold mb-2">Edge-first</h3>
						<p className="text-sm text-muted">
							Built on Cloudflare Workers for sub-millisecond cold starts globally.
						</p>
					</div>

					<div className="glass-card rounded-xl p-6 text-left">
						<div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
							<svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
							</svg>
						</div>
						<h3 className="font-semibold mb-2">D1 Database</h3>
						<p className="text-sm text-muted">
							SQLite at the edge with automatic replication and zero configuration.
						</p>
					</div>

					<div className="glass-card rounded-xl p-6 text-left">
						<div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-4">
							<svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<h3 className="font-semibold mb-2">Secure Auth</h3>
						<p className="text-sm text-muted">
							WebCrypto-powered authentication with constant-time comparisons.
						</p>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="relative z-10 p-6 text-center text-xs text-muted">
				<p>Built with Next.js and Cloudflare</p>
			</footer>
		</div>
	);
}
