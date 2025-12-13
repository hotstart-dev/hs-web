import Link from 'next/link';
import Image from 'next/image';
import { DownloadButton } from '@/components/DownloadButton';
import { ShaderBackground } from '@/components/ShaderBackground';

export default function Home() {
	return (
		<div className="relative w-full min-h-screen overflow-hidden bg-black">
			{/* WebGL Shader Background */}
			<ShaderBackground />

			{/* Header - Fixed position over the shader */}
			<header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 lg:px-12">
				<div className="flex items-center gap-3">
					<Image
						src="/logo.png"
						alt="Hotstart logo"
						width={32}
						height={32}
						className="w-8 h-8"
					/>
					<h1 className="text-2xl font-bold tracking-tight">
						<span className="text-violet-400">Hot</span>
						<span className="text-white">start</span>
					</h1>
				</div>
				<nav className="flex items-center gap-4">
					<Link
						href="/login"
						className="text-sm font-medium text-violet-100/80 hover:text-white transition-colors px-4 py-2"
					>
						Sign in
					</Link>
					<Link
						href="/register"
						className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
					>
						Get started
					</Link>
				</nav>
			</header>

			{/* Hero Content Overlay */}
			<div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
				{/* Trust Badge */}
				<div className="mb-8 animate-fade-in-down">
					<div className="flex items-center gap-2 px-6 py-3 bg-violet-500/10 backdrop-blur-md border border-violet-300/30 rounded-full text-sm">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
						</span>
						<span className="text-violet-100">Now in beta</span>
					</div>
				</div>

				<div className="text-center space-y-6 max-w-5xl mx-auto px-4">
					{/* Main Heading with Animation */}
					<div className="space-y-2">
						<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-300 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
							Get off to a
						</h1>
						<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-fuchsia-300 via-violet-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-400">
							hotstart
						</h1>
					</div>

					{/* Subtitle with Animation */}
					<div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
						<p className="text-lg md:text-xl lg:text-2xl text-violet-100/90 font-light leading-relaxed">
							Get your project up and running in minutes, not hours. Start building what matters instead of setting up infrastructure.
						</p>
					</div>

					{/* Download Button with Animation */}
					<div className="flex flex-col items-center gap-4 mt-10 animate-fade-in-up animation-delay-800">
						<DownloadButton />
					</div>
				</div>

				{/* What you start with */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 px-6 animate-fade-in-up animation-delay-1000">
					<div className="backdrop-blur-md bg-violet-500/5 border border-violet-300/20 rounded-2xl p-6 text-left transition-all duration-300 hover:bg-violet-500/10 hover:border-violet-300/30">
						<div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
							<svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
						<h3 className="font-semibold mb-2 text-violet-100">Application structure</h3>
						<p className="text-sm text-violet-200/60">
							A clean foundation with clear boundaries between frontend, backend, and data.
						</p>
					</div>

					<div className="backdrop-blur-md bg-violet-500/5 border border-violet-300/20 rounded-2xl p-6 text-left transition-all duration-300 hover:bg-violet-500/10 hover:border-violet-300/30">
						<div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
							<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<h3 className="font-semibold mb-2 text-violet-100">Authentication</h3>
						<p className="text-sm text-violet-200/60">
							Sign-in and sessions included. No stubs or placeholders.
						</p>
					</div>

					<div className="backdrop-blur-md bg-violet-500/5 border border-violet-300/20 rounded-2xl p-6 text-left transition-all duration-300 hover:bg-violet-500/10 hover:border-violet-300/30">
						<div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center mb-4">
							<svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
							</svg>
						</div>
						<h3 className="font-semibold mb-2 text-violet-100">Data & migrations</h3>
						<p className="text-sm text-violet-200/60">
							Database, migrations, and explorer included from the start.
						</p>
					</div>
				</div>
			</div>

		</div>
	);
}
