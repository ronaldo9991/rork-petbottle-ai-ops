import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Battery, Zap, TrendingDown, Wrench, Bot } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';
import { productionMetrics } from '@/constants/productionData';

export default function EnergyChart() {
  const { colors } = useTheme();
  const machineAnim = useRef(new Animated.Value(0)).current;
  const robotAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(machineAnim, {
        toValue: productionMetrics.machineDailyKwh / 300,
        duration: 800,
        delay: 200,
        useNativeDriver: false,
      }),
      Animated.timing(robotAnim, {
        toValue: productionMetrics.robotDailyKwh / 300,
        duration: 800,
        delay: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const machineWidth = machineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const robotWidth = robotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <GlassCard style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Energy Consumption</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Daily usage comparison
            </Text>
          </View>
          <View style={[styles.savingsBadge, { backgroundColor: `${colors.success}20` }]}>
            <TrendingDown size={14} color={colors.success} />
            <Text style={[styles.savingsText, { color: colors.success }]}>
              {productionMetrics.energySavingsPercent}% saved
            </Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <View style={[styles.totalIcon, { backgroundColor: `${colors.warning}20` }]}>
            <Zap size={24} color={colors.warning} />
          </View>
          <View>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              {productionMetrics.totalDailyKwh} kWh
            </Text>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
              Total daily • ${productionMetrics.totalDailyCost.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.comparison}>
          <View style={styles.comparisonItem}>
            <View style={styles.comparisonHeader}>
              <View style={[styles.comparisonIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Wrench size={16} color={colors.primary} />
              </View>
              <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>Machines</Text>
              <Text style={[styles.comparisonValue, { color: colors.text }]}>
                {productionMetrics.machineDailyKwh} kWh
              </Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: colors.glass }]}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    width: machineWidth,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.comparisonCost, { color: colors.textMuted }]}>
              ${productionMetrics.machineDailyCost.toFixed(2)}/day
            </Text>
          </View>

          <View style={styles.comparisonItem}>
            <View style={styles.comparisonHeader}>
              <View style={[styles.comparisonIcon, { backgroundColor: '#8b5cf620' }]}>
                <Bot size={16} color="#8b5cf6" />
              </View>
              <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>Robotics</Text>
              <Text style={[styles.comparisonValue, { color: colors.text }]}>
                {productionMetrics.robotDailyKwh} kWh
              </Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: colors.glass }]}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    width: robotWidth,
                    backgroundColor: '#8b5cf6',
                  },
                ]}
              />
            </View>
            <Text style={[styles.comparisonCost, { color: colors.textMuted }]}>
              ${productionMetrics.robotDailyCost.toFixed(2)}/day
            </Text>
          </View>
        </View>

        <View style={[styles.savingsCard, { backgroundColor: `${colors.success}10` }]}>
          <Battery size={20} color={colors.success} />
          <View style={styles.savingsContent}>
            <Text style={[styles.savingsTitle, { color: colors.success }]}>
              Robotics saves ${productionMetrics.energySavings.toFixed(2)}/day
            </Text>
            <Text style={[styles.savingsSubtitle, { color: colors.textSecondary }]}>
              {productionMetrics.robotEnergyPer1000} vs {productionMetrics.machineEnergyPer1000} kWh per 1K bottles
            </Text>
          </View>
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
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  totalIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  totalLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  comparison: {
    gap: 20,
    marginBottom: 16,
  },
  comparisonItem: {
    gap: 8,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  comparisonIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonLabel: {
    flex: 1,
    fontSize: 14,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  barBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  comparisonCost: {
    fontSize: 12,
    textAlign: 'right',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
  },
  savingsContent: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  savingsSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
