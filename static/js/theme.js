tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#222222", // Shin Black
        secondary: "#FFFFFF", // White
        third: "#1E40AF", // Blue
        background: "#f8f8f8", // Slightly Darker Black
        accent: "#FF3E00", // Orange-Red
        textPrimary: "#858383", // Light Gray for text
        textSecondary: "#545252",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
}
