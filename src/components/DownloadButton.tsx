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
	linux: {
		id: 'linux',
		name: 'Linux',
		icon: 'linux',
		downloadUrl: '/distribution/app/linux',
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

	// macOS detection
	if (ua.includes('mac') || platform.includes('mac')) {
		// Check for Apple Silicon
		// Modern detection using userAgentData if available
		if ('userAgentData' in navigator) {
			const uaData = navigator.userAgentData as { platform?: string };
			if (uaData.platform === 'macOS') {
				// Can't reliably detect ARM from userAgentData in all browsers
				// Default to universal/Intel, user can switch
				return 'macos';
			}
		}
		return 'macos';
	}

	// Linux detection
	if (ua.includes('linux') || platform.includes('linux')) {
		return 'linux';
	}

	// Default to macOS
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

function LinuxIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202-.01-.065-.016-.132-.016-.2v-.105l.003-.028a1.38 1.38 0 01.088-.4c.053-.132.123-.27.214-.4a.91.91 0 01.333-.265.865.865 0 01.343-.067zm-2.71.002h.016c.135 0 .258.048.384.13.126.08.242.2.342.335.102.2.166.399.2.598v.065c0 .166-.008.331-.016.465-.168.07-.406.13-.6.2l-.003.003c.022-.135.036-.269.04-.399v-.02a1.186 1.186 0 00-.048-.399.66.66 0 00-.153-.262.428.428 0 00-.214-.133.089.089 0 00-.024 0 .09.09 0 00-.022 0c-.08 0-.153.043-.222.133a.63.63 0 00-.15.262 1.153 1.153 0 00-.045.399v.02c.002.088.006.176.012.262-.16.067-.33.133-.488.2a1.16 1.16 0 01-.013-.265v-.065c.004-.2.053-.397.135-.598.06-.133.15-.266.257-.335a.54.54 0 01.32-.13zm6.24 8.637c.079.2.168.401.24.601.063.202.114.4.135.598.048.267.032.533-.043.8a1.614 1.614 0 01-.344.6 1.97 1.97 0 01-.63.467 3.02 3.02 0 01-.865.267c-.333.053-.67.053-1.001 0a3.02 3.02 0 01-.867-.267 1.97 1.97 0 01-.63-.467 1.614 1.614 0 01-.344-.6c-.075-.267-.091-.533-.043-.8.02-.199.072-.396.135-.598.072-.2.161-.401.24-.601.263.333.58.602.942.798.347.2.737.334 1.164.401.427-.067.817-.201 1.164-.401.362-.196.679-.465.942-.798zm-1.78-.468c-.12.067-.247.134-.383.2-.12.067-.25.067-.377 0-.124-.067-.245-.133-.363-.2-.347-.2-.64-.468-.865-.8a.32.32 0 01-.048-.2c.008-.066.048-.133.103-.199l.003-.004c.059-.066.147-.132.24-.198.089-.067.191-.067.283-.067.093 0 .189.067.277.134.089.066.183.132.269.2l.003.003.002.002c.085.067.169.134.263.2.09.067.179.2.279.267.097-.067.187-.2.276-.267.094-.066.178-.133.263-.2l.003-.003.002-.002c.086-.068.18-.134.27-.2.088-.067.183-.134.276-.134.093 0 .194 0 .283.067.093.066.181.132.24.198l.003.004c.055.066.095.133.103.199a.32.32 0 01-.048.2c-.225.332-.518.6-.865.8z" />
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
		case 'linux':
			return <LinuxIcon className={className} />;
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

