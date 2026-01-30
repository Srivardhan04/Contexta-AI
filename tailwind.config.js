/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Dark Theme Base (Deep Charcoal)
        background: '#0F1117',
        surface: '#161A23',
        sidebar: '#0A0A0F',

        // Typography (High Contrast)
        primary: '#E5E7EB',   // Gray-200
        secondary: '#9CA3AF', // Gray-400
        muted: '#6B7280',     // Gray-500

        // Brand Identity (Electric Indigo)
        accent: {
          DEFAULT: '#6C63FF',
          hover: '#5A52D5',
          cyan: '#22D3EE', // Secondary Neural Cyan
        },

        // Semantic Status
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
        'gradient-user': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(22, 26, 35, 0.7) 0%, rgba(22, 26, 35, 0.4) 100%)',
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.08)', // Subtle border
        highlight: 'rgba(108, 99, 255, 0.25)', // Focus border
      },
    },
  },
}