import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Clock, AlertTriangle, Settings, Package, HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';
import { downtimeReasons } from '@/constants/productionData';

const icons = [
  <Settings size={14} />,
  <Clock size={14} />,
  <AlertTriangle size={14} />,
  <Package size={14} />,
  <HelpCircle size={14} />,
];

const barColors = ['#0EA5E9', '#8b5cf6', '#ffb800', '#ff3366', '#6b7280'];

export default function DowntimeChart() {
  const { colors } = useTheme();
  const barAnims = useRef(downtimeReasons.map(() => new Animated.Value(0))).current;

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

  const totalMinutes = downtimeReasons.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Downtime Analysis</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Total: {totalMinutes} minutes today
          </Text>
        </View>
        <View style={[styles.totalBadge, { backgroundColor: `${colors.warning}20` }]}>
          <Clock size={14} color={colors.warning} />
          <Text style={[styles.totalText, { color: colors.warning }]}>{totalMinutes}m</Text>
        </View>
      </View>

      <View style={styles.barsContainer}>
        {downtimeReasons.map((item, index) => {
          const barWidth = barAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${item.percentage}%`],
          });

          return (
            <View key={item.reason} style={styles.barRow}>
              <View style={styles.barLabelContainer}>
                <View style={[styles.iconContainer, { backgroundColor: `${barColors[index]}20` }]}>
                  {React.cloneElement(icons[index], { color: barColors[index] })}
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.reason}
                </Text>
              </View>
              <View style={styles.barWrapper}>
                <View style={[styles.barBg, { backgroundColor: colors.glass }]}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        width: barWidth,
                        backgroundColor: barColors[index],
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: colors.text }]}>{item.minutes}m</Text>
              </View>
            </View>
          );
        })}
      </View>
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
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  barsContainer: {
    gap: 14,
  },
  barRow: {
    gap: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 13,
    flex: 1,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barBg: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    width: 35,
    textAlign: 'right',
  },
});
