import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					bright: 'hsl(var(--secondary-bright))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Apocalyptic Theme Colors
				terminal: {
					green: 'hsl(var(--terminal-green))',
					amber: 'hsl(var(--terminal-amber))'
				},
				glitch: {
					red: 'hsl(var(--glitch-red))',
					cyan: 'hsl(var(--glitch-cyan))'
				},
				scan: 'hsl(var(--scan-line))'
			},
			fontFamily: {
				'terminal': ['JetBrains Mono', 'monospace'],
				'title': ['Orbitron', 'monospace'],
				'mono': ['JetBrains Mono', 'monospace']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'flicker': {
					'0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
						opacity: '1'
					},
					'20%, 24%, 55%': {
						opacity: '0.4'
					}
				},
				'scan-line': {
					'0%': {
						transform: 'translateY(-100%)'
					},
					'100%': {
						transform: 'translateY(100vh)'
					}
				},
				'glow-pulse': {
					'0%': {
						boxShadow: '0 0 5px hsl(var(--primary) / 0.5)'
					},
					'100%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.8), 0 0 30px hsl(var(--primary) / 0.6)'
					}
				},
				'glitch': {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' },
					'100%': { transform: 'translate(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flicker': 'flicker 0.1s infinite linear alternate',
				'scan-line': 'scan-line 2s linear infinite',
				'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite alternate',
				'glitch': 'glitch 0.3s ease-in-out infinite'
			}
		}
	},
       plugins: [animate],
} satisfies Config;
