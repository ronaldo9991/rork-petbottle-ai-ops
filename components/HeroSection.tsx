import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export default function HeroSection() {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark 
          ? ['rgba(14, 165, 233, 0.15)', 'rgba(139, 92, 246, 0.1)', 'transparent'] 
          : ['rgba(14, 165, 233, 0.1)', 'rgba(139, 92, 246, 0.05)', 'transparent']
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={[styles.title, { color: colors.text }]}>Command Center</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Real-time operations monitoring
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    position: 'relative',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
});
