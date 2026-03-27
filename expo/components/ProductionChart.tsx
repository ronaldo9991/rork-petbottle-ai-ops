import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';
import { hourlyData } from '@/constants/productionData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const BAR_WIDTH = (CHART_WIDTH - 80) / hourlyData.length - 8;
const MAX_VALUE = 2500;

export default function ProductionChart() {
  const { colors } = useTheme();
  const barAnims = useRef(hourlyData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = barAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: false,
      })
    );
    Animated.stagger(80, animations).start();
  }, []);

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Production Timeline</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Hourly throughput vs target
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {[2500, 2200, 2000, 1500, 1000].map((val) => (
            <Text key={val} style={[styles.yLabel, { color: colors.textMuted }]}>
              {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            </Text>
          ))}
        </View>

        <View style={styles.chart}>
          <View 
            style={[
              styles.targetLine, 
              { 
                backgroundColor: colors.warning,
                bottom: (2200 / MAX_VALUE) * 120 
              }
            ]} 
          />
          
          <View style={styles.barsContainer}>
            {hourlyData.map((item, index) => {
              const barHeight = barAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, (item.actual / MAX_VALUE) * 120],
              });

              const isAboveTarget = item.actual >= item.target;

              return (
                <View key={item.hour} style={styles.barWrapper}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isAboveTarget ? colors.success : colors.warning,
                        shadowColor: isAboveTarget ? colors.success : colors.warning,
                      },
                    ]}
                  />
                  <Text style={[styles.xLabel, { color: colors.textMuted }]}>
                    {item.hour.split(':')[0]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Above Target</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Target (2,200)</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 160,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  yLabel: {
    fontSize: 10,
    textAlign: 'right',
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingTop: 8,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  xLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
