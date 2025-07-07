import type { Config } from "tailwindcss";

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
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
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
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Game-specific colors
				player: {
					red: 'hsl(var(--player-red))',
					blue: 'hsl(var(--player-blue))',
					green: 'hsl(var(--player-green))',
					yellow: 'hsl(var(--player-yellow))',
					purple: 'hsl(var(--player-purple))',
					orange: 'hsl(var(--player-orange))'
				},
				heart: {
					DEFAULT: 'hsl(var(--heart))',
					light: 'hsl(var(--heart-light))'
				},
				praise: {
					DEFAULT: 'hsl(var(--praise))',
					light: 'hsl(var(--praise-light))'
				}
			},
			backgroundImage: {
				'gradient-warm': 'var(--gradient-warm)',
				'gradient-heart': 'var(--gradient-heart)',
				'gradient-praise': 'var(--gradient-praise)',
				'gradient-background': 'var(--gradient-background)'
			},
			boxShadow: {
				'warm': 'var(--shadow-warm)',
				'card': 'var(--shadow-card)',
				'glow': 'var(--shadow-glow)'
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
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
				// Game animations
				'dice-roll': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'25%': { transform: 'rotate(90deg) scale(1.1)' },
					'50%': { transform: 'rotate(180deg) scale(1.2)' },
					'75%': { transform: 'rotate(270deg) scale(1.1)' },
					'100%': { transform: 'rotate(360deg) scale(1)' }
				},
				'piece-move': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.3) translateY(-10px)' },
					'100%': { transform: 'scale(1)' }
				},
				'heart-burst': {
					'0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
					'50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
					'100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
				},
				'celebration': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'25%': { transform: 'scale(1.1) rotate(-5deg)' },
					'50%': { transform: 'scale(1.2) rotate(5deg)' },
					'75%': { transform: 'scale(1.1) rotate(-5deg)' },
					'100%': { transform: 'scale(1) rotate(0deg)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3) translateY(-100px)', opacity: '0' },
					'50%': { transform: 'scale(1.05) translateY(0)', opacity: '1' },
					'70%': { transform: 'scale(0.9)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				// 사다리 게임 전용 애니메이션
				'ladder-glow': {
					'0%': { boxShadow: '0 0 5px rgba(var(--primary), 0.3)' },
					'50%': { boxShadow: '0 0 20px rgba(var(--primary), 0.6), 0 0 30px rgba(var(--primary), 0.4)' },
					'100%': { boxShadow: '0 0 5px rgba(var(--primary), 0.3)' }
				},
				'step-highlight': {
					'0%': { backgroundColor: 'rgba(var(--primary), 0.1)' },
					'50%': { backgroundColor: 'rgba(var(--primary), 0.3)' },
					'100%': { backgroundColor: 'rgba(var(--primary), 0.1)' }
				},
				'connection-flow': {
					'0%': { opacity: '0.3', transform: 'scaleY(0.5)' },
					'50%': { opacity: '1', transform: 'scaleY(1.2)' },
					'100%': { opacity: '0.3', transform: 'scaleY(0.5)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'dice-roll': 'dice-roll 1s ease-in-out',
				'piece-move': 'piece-move 0.6s ease-in-out',
				'heart-burst': 'heart-burst 0.8s ease-out',
				'celebration': 'celebration 0.6s ease-in-out infinite',
				'bounce-in': 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				// 사다리 게임 전용 애니메이션
				'ladder-glow': 'ladder-glow 2s ease-in-out infinite',
				'step-highlight': 'step-highlight 3s ease-in-out infinite',
				'connection-flow': 'connection-flow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
