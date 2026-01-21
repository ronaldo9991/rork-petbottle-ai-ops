export const Colors = {
  dark: {
    background: '#0a0a0f',
    surface: '#1a1a2e',
    surfaceLight: '#252542',
    primary: '#0EA5E9',
    accent: '#00d4ff',
    success: '#00ff88',
    warning: '#ffb800',
    danger: '#ff3366',
    text: '#ffffff',
    textSecondary: '#a0aec0',
    textMuted: '#6b7280',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassStrong: 'rgba(255, 255, 255, 0.08)',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    tabBar: '#12121a',
    tabBarBorder: 'rgba(255, 255, 255, 0.05)',
  },
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceLight: '#f1f5f9',
    primary: '#0EA5E9',
    accent: '#00a8cc',
    success: '#00c853',
    warning: '#ff9800',
    danger: '#e91e63',
    text: '#1a202c',
    textSecondary: '#718096',
    textMuted: '#a0aec0',
    glass: 'rgba(0, 0, 0, 0.02)',
    glassBorder: 'rgba(0, 0, 0, 0.08)',
    glassStrong: 'rgba(0, 0, 0, 0.04)',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    tabBar: '#ffffff',
    tabBarBorder: 'rgba(0, 0, 0, 0.08)',
  },
};

export type ThemeColors = typeof Colors.dark;

export default Colors;
