/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				primary: {
					DEFAULT: '#3B82F6', // Bright blue
					foreground: '#FFFFFF',
					50: '#EFF6FF',
					100: '#DBEAFE',
					500: '#3B82F6',
					600: '#2563EB',
					700: '#1D4ED8',
				},
				
				secondary: {
					DEFAULT: '#1E293B', // Dark blue-gray
					foreground: '#F8FAFC',
				},
				
				accent: {
					DEFAULT: '#7C3AED', // Purple
					foreground: '#FFFFFF',
				},
				
				// Vibrant color palette
				neon: {
					DEFAULT: '#A855F7',
					50: '#F3E8FF',
					100: '#E9D5FF',
					500: '#A855F7',
					600: '#9333EA',
				},
				
				teal: {
					DEFAULT: '#0D9488',
					50: '#F0FDFA',
					100: '#CCFBF1',
					500: '#0D9488',
					600: '#0F766E',
				},
				
				orange: {
					DEFAULT: '#EA580C',
					50: '#FFF7ED',
					100: '#FFEDD5',
					500: '#EA580C',
					600: '#DC2626',
				},
				
				// Analytics specific colors
				success: {
					DEFAULT: '#0D9488',
					50: '#F0FDFA',
					100: '#CCFBF1',
					500: '#0D9488',
				},
				warning: {
					DEFAULT: '#EA580C',
					50: '#FFF7ED',
					100: '#FFEDD5',
					500: '#EA580C',
				},
				info: {
					DEFAULT: '#3B82F6',
					50: '#EFF6FF',
					100: '#DBEAFE',
					500: '#3B82F6',
				},
				danger: {
					DEFAULT: '#EF4444',
					50: '#FEF2F2',
					100: '#FEE2E2',
					500: '#EF4444',
				},
				
				muted: {
					DEFAULT: '#1E293B',
					foreground: '#94A3B8',
				},
				
				card: {
					DEFAULT: 'rgba(255, 255, 255, 0.05)',
					foreground: '#F8FAFC',
				},
				
				popover: {
					DEFAULT: 'rgba(255, 255, 255, 0.05)',
					foreground: '#F8FAFC',
				},
				
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF',
				},
			},
			borderRadius: {
				lg: '0.75rem',
				md: '0.5rem',
				sm: '0.25rem',
				xl: '1rem',
				'2xl': '1.5rem',
			},
			backdropBlur: {
				xs: '2px',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				
				// New animations for enhanced UX
				'fade-in-up': 'fadeInUp 0.6s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'slide-in-right': 'slideInRight 0.5s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'bounce-gentle': 'bounceGentle 2s infinite',
				'rotate-slow': 'rotateSlow 8s linear infinite',
				
				// Stagger animations
				'stagger-1': 'fadeInUp 0.6s ease-out 0.1s both',
				'stagger-2': 'fadeInUp 0.6s ease-out 0.2s both',
				'stagger-3': 'fadeInUp 0.6s ease-out 0.3s both',
				'stagger-4': 'fadeInUp 0.6s ease-out 0.4s both',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fadeIn': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fadeInUp': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'scaleIn': {
					'0%': { 
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': { 
						opacity: '1',
						transform: 'scale(1)'
					},
				},
				'slideInRight': {
					'0%': { 
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateX(0)'
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'pulseGlow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
					},
					'50%': { 
						boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)'
					},
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'bounceGentle': {
					'0%, 100%': { 
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': { 
						transform: 'translateY(-10px)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					},
				},
				'rotateSlow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			transitionDuration: {
				'400': '400ms',
				'600': '600ms',
				'800': '800ms',
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			scale: {
				'102': '1.02',
				'103': '1.03',
			},
			rotate: {
				'1': '1deg',
				'2': '2deg',
				'3': '3deg',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}