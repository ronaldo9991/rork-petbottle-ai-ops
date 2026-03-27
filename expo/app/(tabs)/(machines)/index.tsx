import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wrench, Activity, Zap, AlertTriangle, DollarSign, Battery, Users, TrendingUp, Settings, CheckCircle, XCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { productionMetrics } from '@/constants/productionData';

const { width } = Dimensions.get('window');

const machines = [
  { id: 'M-001', status: 'operational', efficiency: 92, output: 142 },
  { id: 'M-002', status: 'operational', efficiency: 88, output: 138 },
  { id: 'M-003', status: 'maintenance', efficiency: 0, output: 0 },
  { id: 'M-004', status: 'operational', efficiency: 85, output: 132 },
  { id: 'M-005', status: 'operational', efficiency: 90, output: 140 },
  { id: 'M-006', status: 'operational', efficiency: 87, output: 136 },
  { id: 'M-007', status: 'operational', efficiency: 91, output: 141 },
  { id: 'M-008', status: 'maintenance', efficiency: 0, output: 0 },
  { id: 'M-009', status: 'operational', efficiency: 86, output: 135 },
  { id: 'M-010', status: 'operational', efficiency: 89, output: 139 },
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  accentColor: string;
  delay: number;
}

function StatCard({ icon, label, value, subValue, accentColor, delay }: StatCardProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View style={[styles.statCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <GlassCard>
        <View style={[styles.statIconContainer, { backgroundColor: `${accentColor}20` }]}>
          {icon}
        </View>
        <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        {subValue && <Text style={[styles.statSubValue, { color: colors.textMuted }]}>{subValue}</Text>}
      </GlassCard>
    </Animated.View>
  );
}

function MachineCard({ machine, index }: { machine: typeof machines[0]; index: number }) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 400 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 400 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const isOperational = machine.status === 'operational';
  const statusColor = isOperational ? colors.success : colors.warning;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <GlassCard style={styles.machineCard}>
        <View style={styles.machineHeader}>
          <View style={styles.machineIdContainer}>
            <View style={[styles.machineIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Wrench size={18} color={colors.primary} />
            </View>
            <Text style={[styles.machineId, { color: colors.text }]}>{machine.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            {isOperational ? (
              <CheckCircle size={14} color={statusColor} />
            ) : (
              <Settings size={14} color={statusColor} />
            )}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {isOperational ? 'Operational' : 'Maintenance'}
            </Text>
          </View>
        </View>
        
        {isOperational && (
          <View style={styles.machineStats}>
            <View style={styles.machineStat}>
              <Text style={[styles.machineStatValue, { color: colors.text }]}>{machine.efficiency}%</Text>
              <Text style={[styles.machineStatLabel, { color: colors.textMuted }]}>Efficiency</Text>
            </View>
            <View style={[styles.machineStatDivider, { backgroundColor: colors.glassBorder }]} />
            <View style={styles.machineStat}>
              <Text style={[styles.machineStatValue, { color: colors.text }]}>{machine.output}/hr</Text>
              <Text style={[styles.machineStatLabel, { color: colors.textMuted }]}>Output</Text>
            </View>
          </View>
        )}
      </GlassCard>
    </Animated.View>
  );
}

function EfficiencyChart() {
  const { colors } = useTheme();
  const barAnims = useRef(machines.filter(m => m.status === 'operational').map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = barAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 600 + index * 100,
        useNativeDriver: false,
      })
    );
    Animated.stagger(80, animations).start();
  }, []);

  const operationalMachines = machines.filter(m => m.status === 'operational');

  return (
    <GlassCard style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>Machine Efficiency</Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Individual performance metrics</Text>
      
      <View style={styles.efficiencyBars}>
        {operationalMachines.map((machine, index) => {
          const barHeight = barAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, (machine.efficiency / 100) * 100],
          });

          return (
            <View key={machine.id} style={styles.efficiencyBarWrapper}>
              <Animated.View
                style={[
                  styles.efficiencyBar,
                  {
                    height: barHeight,
                    backgroundColor: machine.efficiency >= 90 ? colors.success : 
                      machine.efficiency >= 85 ? colors.primary : colors.warning,
                  },
                ]}
              />
              <Text style={[styles.efficiencyLabel, { color: colors.textMuted }]}>
                {machine.id.split('-')[1]}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>≥90%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>85-89%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>&lt;85%</Text>
        </View>
      </View>
    </GlassCard>
  );
}

export default function MachinesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedBackground />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: `${colors.primary}20` }]}>
            <Wrench size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Machines</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {productionMetrics.operationalMachines}/{productionMetrics.totalMachines} operational
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<TrendingUp size={20} color={colors.primary} />}
            label="Output/Hour"
            value={`${productionMetrics.machineBottlesPerHour}`}
            subValue="bottles"
            accentColor={colors.primary}
            delay={0}
          />
          <StatCard
            icon={<Activity size={20} color={colors.success} />}
            label="OEE"
            value={`${(productionMetrics.machineOEE * 100).toFixed(0)}%`}
            accentColor={colors.success}
            delay={100}
          />
          <StatCard
            icon={<AlertTriangle size={20} color={colors.warning} />}
            label="Defect Rate"
            value={`${productionMetrics.machineDefectRate}/100`}
            accentColor={colors.warning}
            delay={200}
          />
          <StatCard
            icon={<DollarSign size={20} color={colors.accent} />}
            label="Cost/Bottle"
            value={`$${productionMetrics.machineCostPerBottle.toFixed(3)}`}
            accentColor={colors.accent}
            delay={300}
          />
          <StatCard
            icon={<Battery size={20} color="#8b5cf6" />}
            label="Energy/1K"
            value={`${productionMetrics.machineEnergyPer1000}`}
            subValue="kWh"
            accentColor="#8b5cf6"
            delay={400}
          />
          <StatCard
            icon={<Users size={20} color={colors.danger} />}
            label="Workers"
            value={`${productionMetrics.machineWorkers}`}
            subValue={`$${productionMetrics.machineLaborCostPerHour}/hr`}
            accentColor={colors.danger}
            delay={500}
          />
        </View>

        <EfficiencyChart />

        <View style={styles.machinesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Machines</Text>
          {machines.map((machine, index) => (
            <MachineCard key={machine.id} machine={machine} index={index} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 44) / 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  statSubValue: {
    fontSize: 11,
    marginTop: 2,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  chartSubtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  efficiencyBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 8,
  },
  efficiencyBarWrapper: {
    alignItems: 'center',
  },
  efficiencyBar: {
    width: 24,
    borderRadius: 6,
    marginBottom: 8,
  },
  efficiencyLabel: {
    fontSize: 10,
  },
  chartLegend: {
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
  machinesSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  machineCard: {
    marginBottom: 0,
  },
  machineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  machineIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  machineIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineId: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  machineStats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  machineStat: {
    flex: 1,
    alignItems: 'center',
  },
  machineStatDivider: {
    width: 1,
    height: '100%',
  },
  machineStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  machineStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
