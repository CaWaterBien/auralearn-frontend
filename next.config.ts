import type { NextConfig } from "next";

// Get backend URL from environment variable
// In development (localhost), we'll use Next.js proxy to avoid CORS issues
// In production (Vercel), we'll call the backend directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_ADMIN_API_BASE || process.env.NEXT_PUBLIC_USER_API_BASE || 'https://limitless-caverns-03788-f84f5932a44c.herokuapp.com';

const nextConfig: NextConfig = {
	async rewrites() {
		// Always use proxy in development to avoid CORS and cookie issues
		// This allows localhost:3000 to communicate with Heroku backend seamlessly
		// In production (Vercel), this won't be used - direct API calls will be made
		return [
			// Proxy all API calls to backend
			// This makes the browser think it's same-origin, so cookies work
			{
				source: '/api/:path*',
				destination: `${API_BASE_URL}/api/:path*`,
			},
			// Proxy storage files (images, videos, etc.) to backend
			{
				source: '/storage/:path*',
				destination: `${API_BASE_URL}/storage/:path*`,
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Experimental features
	experimental: {
		// Add any valid experimental features here when needed
	},
	// Configure React to be more tolerant of hydration mismatches
	reactStrictMode: false, // Disable strict mode to reduce hydration warnings
	// Add webpack configuration to inject hydration suppressor
	webpack: (config, { dev, isServer }) => {
		if (dev && !isServer) {
			// Inject hydration error suppression in development
			config.entry = async () => {
				const entries = await config.entry();
				if (entries['main.js'] && !entries['main.js'].includes('./hydration-fix.js')) {
					entries['main.js'].unshift('./hydration-fix.js');
				}
				return entries;
			};
		}
		return config;
	},
	// Headers for security and caching
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
					{
						key: 'Pragma',
						value: 'no-cache',
					},
					{
						key: 'Expires',
						value: '0',
					},
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http: https:; frame-src 'self' data: blob: http: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data: http: https:; img-src 'self' data: blob: http: https:; connect-src 'self' http: https:;",
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
		];
	},
};

export default nextConfig;
