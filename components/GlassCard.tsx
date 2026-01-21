import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  neonColor?: string;
  showGlow?: boolean;
}

export default function GlassCard({ 
  children, 
  style, 
  intensity = 20,
  neonColor,
  showGlow = false,
}: GlassCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.glass,
        borderColor: colors.glassBorder,
        shadowColor: showGlow && neonColor ? neonColor : colors.cardShadow,
        shadowOpacity: showGlow ? 0.4 : 0.3,
      },
      style,
    ]}>
      <BlurView
        intensity={isDark ? intensity : intensity / 2}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 8,
  },
  content: {
    padding: 16,
  },
});
