import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wrench, Bot, Trophy } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';
import { productionMetrics } from '@/constants/productionData';

interface MetricRowProps {
  label: string;
  machineValue: string;
  robotValue: string;
  robotWins?: boolean;
  colors: any;
}

function MetricRow({ label, machineValue, robotValue, robotWins, colors }: MetricRowProps) {
  return (
    <View style={styles.metricRow}>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.metricValues}>
        <Text style={[styles.metricValue, { color: colors.text }]}>{machineValue}</Text>
        <View style={styles.metricDivider} />
        <View style={styles.robotValueContainer}>
          <Text style={[
            styles.metricValue, 
            { color: robotWins ? colors.success : colors.text }
          ]}>
            {robotValue}
          </Text>
          {robotWins && <Text style={styles.star}>⭐</Text>}
        </View>
      </View>
    </View>
  );
}

export default function ComparisonCard() {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Machines vs Robotics</Text>
      
      <View style={styles.headers}>
        <View style={styles.headerItem}>
          <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}20` }]}>
            <Wrench size={20} color={colors.primary} />
          </View>
          <Text style={[styles.headerText, { color: colors.text }]}>Machines</Text>
        </View>
        <View style={styles.headerItem}>
          <View style={[styles.iconCircle, { backgroundColor: '#8b5cf620' }]}>
            <Bot size={20} color="#8b5cf6" />
          </View>
          <Text style={[styles.headerText, { color: colors.text }]}>Robotics</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <MetricRow 
          label="Production" 
          machineValue={`${productionMetrics.machineBottlesPerHour.toLocaleString()}/hr`}
          robotValue={`${productionMetrics.robotBottlesPerHour.toLocaleString()}/hr`}
          colors={colors}
        />
        <MetricRow 
          label="OEE" 
          machineValue={`${(productionMetrics.machineOEE * 100).toFixed(0)}%`}
          robotValue={`${(productionMetrics.robotOEE * 100).toFixed(0)}%`}
          robotWins
          colors={colors}
        />
        <MetricRow 
          label="Defect Rate" 
          machineValue={`${productionMetrics.machineDefectRate}/100`}
          robotValue={`${productionMetrics.robotDefectRate}/100`}
          robotWins
          colors={colors}
        />
        <MetricRow 
          label="Cost/Bottle" 
          machineValue={`$${productionMetrics.machineCostPerBottle.toFixed(3)}`}
          robotValue={`$${productionMetrics.robotCostPerBottle.toFixed(3)}`}
          robotWins
          colors={colors}
        />
        <MetricRow 
          label="Energy/1K" 
          machineValue={`${productionMetrics.machineEnergyPer1000} kWh`}
          robotValue={`${productionMetrics.robotEnergyPer1000} kWh`}
          robotWins
          colors={colors}
        />
        <MetricRow 
          label="Workers" 
          machineValue={`${productionMetrics.machineWorkers}`}
          robotValue={`${productionMetrics.robotWorkers}`}
          robotWins
          colors={colors}
        />
      </View>

      <View style={[styles.winnerBadge, { backgroundColor: `${colors.success}15` }]}>
        <Trophy size={16} color={colors.success} />
        <Text style={[styles.winnerText, { color: colors.success }]}>Robotics Wins</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  headerItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  metrics: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  metricLabel: {
    fontSize: 13,
    flex: 1,
  },
  metricValues: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    width: 80,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 8,
  },
  robotValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'center',
  },
  star: {
    fontSize: 10,
    marginLeft: 2,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  winnerText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
});
