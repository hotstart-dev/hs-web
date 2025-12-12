'use client';

import { useEffect, useState } from 'react';

// Platform configuration
const PLATFORMS = {
	macos: {
		id: 'macos',
		name: 'macOS',
		icon: 'apple',
		downloadUrl: '/distribution/app/macos',
	},
	'macos-arm': {
		id: 'macos-arm',
		name: 'macOS (Apple Silicon)',
		icon: 'apple',
		downloadUrl: '/distribution/app/macos-arm',
	},
	windows: {
		id: 'windows',
		name: 'Windows',
		icon: 'windows',
		downloadUrl: '/distribution/app/windows',
	},
};

type PlatformKey = keyof typeof PLATFORMS;

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.hotstart.dev';

/**
 * Detect user's platform from user agent
 */
function detectPlatform(): PlatformKey {
	if (typeof window === 'undefined') return 'macos';

	const ua = navigator.userAgent.toLowerCase();
	const platform = navigator.platform?.toLowerCase() || '';

	// Windows detection
	if (ua.includes('win') || platform.includes('win')) {
		return 'windows';
	}

	// macOS detection (default for non-Windows)
	return 'macos';
}

/**
 * Platform icon components
 */
function AppleIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
		</svg>
	);
}

function WindowsIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M3 12V6.75l6-1.32v6.48L3 12m17-9v8.75l-10 .15V5.21L20 3M3 13l6 .09v6.81l-6-1.15V13m17 .25V22l-10-1.91V13.1l10 .15z" />
		</svg>
	);
}

function DownloadIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
		</svg>
	);
}

function ChevronDownIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
		</svg>
	);
}

/**
 * Get platform icon component
 */
function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
	switch (platform) {
		case 'apple':
			return <AppleIcon className={className} />;
		case 'windows':
			return <WindowsIcon className={className} />;
		default:
			return <DownloadIcon className={className} />;
	}
}

interface DownloadButtonProps {
	className?: string;
	showOtherPlatforms?: boolean;
}

export function DownloadButton({ className = '', showOtherPlatforms = true }: DownloadButtonProps) {
	const [platform, setPlatform] = useState<PlatformKey>('macos');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setPlatform(detectPlatform());
		setIsLoading(false);
	}, []);

	const currentPlatform = PLATFORMS[platform];
	const otherPlatforms = Object.values(PLATFORMS).filter((p) => p.id !== platform);
	const downloadUrl = `${API_BASE}${currentPlatform.downloadUrl}`;

	if (isLoading) {
		return (
			<div className={`btn-primary text-base px-8 py-3.5 rounded-xl opacity-50 ${className}`}>
				<span className="flex items-center gap-2">
					<DownloadIcon className="w-5 h-5" />
					Loading...
				</span>
			</div>
		);
	}

	return (
		<div className="relative inline-block">
			<div className="flex">
				{/* Main download button */}
				<a
					href={downloadUrl}
					className={`btn-primary text-base pl-6 pr-4 py-3.5 rounded-l-xl flex items-center gap-3 ${className}`}
				>
					<PlatformIcon platform={currentPlatform.icon} className="w-5 h-5" />
					<span>Download for {currentPlatform.name}</span>
				</a>

				{/* Dropdown toggle */}
				{showOtherPlatforms && (
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="btn-primary px-3 py-3.5 rounded-r-xl border-l border-white/20 hover:bg-primary-hover"
						aria-label="Other platforms"
					>
						<ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
					</button>
				)}
			</div>

			{/* Dropdown menu */}
			{showOtherPlatforms && isDropdownOpen && (
				<>
					{/* Backdrop to close dropdown */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsDropdownOpen(false)}
					/>

					{/* Dropdown */}
					<div className="absolute right-0 mt-2 w-64 rounded-xl bg-secondary border border-border shadow-xl z-20 overflow-hidden">
						<div className="py-1">
							<div className="px-4 py-2 text-xs text-muted uppercase tracking-wider">
								Other platforms
							</div>
							{otherPlatforms.map((p) => (
								<a
									key={p.id}
									href={`${API_BASE}${p.downloadUrl}`}
									className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
									onClick={() => setIsDropdownOpen(false)}
								>
									<PlatformIcon platform={p.icon} className="w-5 h-5 text-muted" />
									<span className="text-foreground">{p.name}</span>
								</a>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}

/**
 * Simple download link for specific platform
 */
export function DownloadLink({
	platform,
	children,
	className = '',
}: {
	platform: PlatformKey;
	children: React.ReactNode;
	className?: string;
}) {
	const config = PLATFORMS[platform];
	const downloadUrl = `${API_BASE}${config.downloadUrl}`;

	return (
		<a href={downloadUrl} className={className}>
			{children}
		</a>
	);
}
