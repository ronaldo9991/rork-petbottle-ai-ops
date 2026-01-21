import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';
import { defectTypes, productionMetrics } from '@/constants/productionData';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 100, 180);

const pieColors = ['#ff3366', '#ffb800', '#8b5cf6', '#0EA5E9', '#6b7280'];

export default function DefectsChart() {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const totalDefects = defectTypes.reduce((sum, item) => sum + item.count, 0);

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Defect Breakdown</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {totalDefects} defects ({productionMetrics.defectRate}% rate)
          </Text>
        </View>
        <View style={[styles.qualityBadge, { backgroundColor: `${colors.success}20` }]}>
          <ShieldCheck size={14} color={colors.success} />
          <Text style={[styles.qualityText, { color: colors.success }]}>Good</Text>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.chartContainer, 
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <View style={styles.pieChart}>
          {defectTypes.map((item, index) => {
            const startAngle = defectTypes
              .slice(0, index)
              .reduce((sum, d) => sum + (d.percentage / 100) * 360, 0);
            const sweepAngle = (item.percentage / 100) * 360;
            
            return (
              <View
                key={item.type}
                style={[
                  styles.pieSlice,
                  {
                    backgroundColor: pieColors[index],
                    transform: [
                      { rotate: `${startAngle}deg` },
                    ],
                    opacity: 0.9,
                  },
                ]}
              />
            );
          })}
          <View style={[styles.pieCenter, { backgroundColor: colors.surface }]}>
            <ShieldAlert size={24} color={colors.danger} />
            <Text style={[styles.pieCenterValue, { color: colors.text }]}>{totalDefects}</Text>
            <Text style={[styles.pieCenterLabel, { color: colors.textMuted }]}>defects</Text>
          </View>
        </View>

        <View style={styles.legend}>
          {defectTypes.map((item, index) => (
            <View key={item.type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: pieColors[index] }]} />
              <Text style={[styles.legendLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.type}
              </Text>
              <Text style={[styles.legendValue, { color: colors.text }]}>{item.count}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  pieChart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    borderRadius: CHART_SIZE / 2,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '50%',
    top: 0,
    transformOrigin: 'left bottom',
  },
  pieCenter: {
    position: 'absolute',
    width: CHART_SIZE * 0.6,
    height: CHART_SIZE * 0.6,
    borderRadius: CHART_SIZE * 0.3,
    top: CHART_SIZE * 0.2,
    left: CHART_SIZE * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenterValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  pieCenterLabel: {
    fontSize: 11,
  },
  legend: {
    flex: 1,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
