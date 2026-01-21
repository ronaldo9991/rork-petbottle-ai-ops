import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  accentColor?: string;
  showGlow?: boolean;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor,
  showGlow = false,
  delay = 0,
}: KPICardProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  const glowColor = accentColor || colors.primary;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <GlassCard showGlow={showGlow} neonColor={glowColor}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${glowColor}20` }]}>
            {icon}
          </View>
          {trend && (
            <View style={[
              styles.trendBadge,
              { backgroundColor: trend.isPositive ? `${colors.success}20` : `${colors.danger}20` }
            ]}>
              <Text style={[
                styles.trendText,
                { color: trend.isPositive ? colors.success : colors.danger }
              ]}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.value, { color: accentColor || colors.text }]}>
          {value}
        </Text>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '45%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  value: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});
