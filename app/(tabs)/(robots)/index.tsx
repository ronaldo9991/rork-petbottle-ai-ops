import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Activity, Zap, AlertTriangle, DollarSign, Battery, Users, TrendingUp, CheckCircle, Cpu, Gauge } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { productionMetrics } from '@/constants/productionData';

const { width } = Dimensions.get('window');

const robots = [
  { id: 'R-001', status: 'operational', efficiency: 94, output: 198, cycles: 12450, uptime: 99.2 },
  { id: 'R-002', status: 'operational', efficiency: 91, output: 192, cycles: 11890, uptime: 98.8 },
  { id: 'R-003', status: 'operational', efficiency: 88, output: 186, cycles: 10250, uptime: 97.5 },
  { id: 'R-004', status: 'calibrating', efficiency: 0, output: 0, cycles: 9800, uptime: 0 },
  { id: 'R-005', status: 'operational', efficiency: 93, output: 196, cycles: 12100, uptime: 99.0 },
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

function RobotCard({ robot, index }: { robot: typeof robots[0]; index: number }) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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

    if (robot.status === 'operational') {
      Animated.timing(progressAnim, {
        toValue: robot.efficiency / 100,
        duration: 800,
        delay: 600 + index * 80,
        useNativeDriver: false,
      }).start();
    }
  }, [index, robot.efficiency, robot.status]);

  const isOperational = robot.status === 'operational';
  const statusColor = isOperational ? colors.success : '#8b5cf6';

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <GlassCard style={styles.robotCard}>
        <View style={styles.robotHeader}>
          <View style={styles.robotIdContainer}>
            <View style={[styles.robotIcon, { backgroundColor: '#8b5cf620' }]}>
              <Bot size={18} color="#8b5cf6" />
            </View>
            <View>
              <Text style={[styles.robotId, { color: colors.text }]}>{robot.id}</Text>
              <Text style={[styles.robotCycles, { color: colors.textMuted }]}>
                {robot.cycles.toLocaleString()} cycles
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            {isOperational ? (
              <CheckCircle size={14} color={statusColor} />
            ) : (
              <Cpu size={14} color={statusColor} />
            )}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {isOperational ? 'Operational' : 'Calibrating'}
            </Text>
          </View>
        </View>
        
        {isOperational && (
          <>
            <View style={styles.robotStats}>
              <View style={styles.robotStat}>
                <Gauge size={16} color={colors.textMuted} />
                <Text style={[styles.robotStatValue, { color: colors.text }]}>{robot.efficiency}%</Text>
                <Text style={[styles.robotStatLabel, { color: colors.textMuted }]}>Efficiency</Text>
              </View>
              <View style={[styles.robotStatDivider, { backgroundColor: colors.glassBorder }]} />
              <View style={styles.robotStat}>
                <Zap size={16} color={colors.textMuted} />
                <Text style={[styles.robotStatValue, { color: colors.text }]}>{robot.output}/hr</Text>
                <Text style={[styles.robotStatLabel, { color: colors.textMuted }]}>Output</Text>
              </View>
              <View style={[styles.robotStatDivider, { backgroundColor: colors.glassBorder }]} />
              <View style={styles.robotStat}>
                <Activity size={16} color={colors.textMuted} />
                <Text style={[styles.robotStatValue, { color: colors.text }]}>{robot.uptime}%</Text>
                <Text style={[styles.robotStatLabel, { color: colors.textMuted }]}>Uptime</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBg, { backgroundColor: colors.glass }]}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressWidth,
                      backgroundColor: robot.efficiency >= 90 ? colors.success : colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </>
        )}
      </GlassCard>
    </Animated.View>
  );
}

function PerformanceChart() {
  const { colors } = useTheme();
  const barAnims = useRef(robots.filter(r => r.status === 'operational').map(() => new Animated.Value(0))).current;

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

  const operationalRobots = robots.filter(r => r.status === 'operational');

  return (
    <GlassCard style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>Robot Performance</Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Output comparison (bottles/hr)</Text>
      
      <View style={styles.performanceBars}>
        {operationalRobots.map((robot, index) => {
          const barHeight = barAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, (robot.output / 200) * 100],
          });

          return (
            <View key={robot.id} style={styles.performanceBarWrapper}>
              <Text style={[styles.performanceValue, { color: colors.text }]}>{robot.output}</Text>
              <Animated.View
                style={[
                  styles.performanceBar,
                  {
                    height: barHeight,
                    backgroundColor: '#8b5cf6',
                    shadowColor: '#8b5cf6',
                  },
                ]}
              />
              <Text style={[styles.performanceLabel, { color: colors.textMuted }]}>
                {robot.id}
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

function UptimeChart() {
  const { colors } = useTheme();
  const operationalRobots = robots.filter(r => r.status === 'operational');
  const avgUptime = operationalRobots.reduce((sum, r) => sum + r.uptime, 0) / operationalRobots.length;

  return (
    <GlassCard style={styles.uptimeCard}>
      <View style={styles.uptimeHeader}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>System Uptime</Text>
        <View style={[styles.uptimeBadge, { backgroundColor: `${colors.success}20` }]}>
          <Text style={[styles.uptimeBadgeText, { color: colors.success }]}>Excellent</Text>
        </View>
      </View>
      
      <View style={styles.uptimeContent}>
        <View style={styles.uptimeRing}>
          <Text style={[styles.uptimeValue, { color: colors.success }]}>{avgUptime.toFixed(1)}%</Text>
          <Text style={[styles.uptimeLabel, { color: colors.textSecondary }]}>Average</Text>
        </View>
        
        <View style={styles.uptimeStats}>
          {operationalRobots.map((robot) => (
            <View key={robot.id} style={styles.uptimeStat}>
              <Text style={[styles.uptimeStatLabel, { color: colors.textMuted }]}>{robot.id}</Text>
              <View style={styles.uptimeBarContainer}>
                <View
                  style={[
                    styles.uptimeBar,
                    {
                      width: `${robot.uptime}%`,
                      backgroundColor: robot.uptime >= 99 ? colors.success : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.uptimeStatValue, { color: colors.text }]}>{robot.uptime}%</Text>
            </View>
          ))}
        </View>
      </View>
    </GlassCard>
  );
}

export default function RobotsScreen() {
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
          <View style={[styles.headerIcon, { backgroundColor: '#8b5cf620' }]}>
            <Bot size={28} color="#8b5cf6" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Robotics</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {productionMetrics.operationalRobots}/{productionMetrics.totalRobots} operational
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<TrendingUp size={20} color="#8b5cf6" />}
            label="Output/Hour"
            value={`${productionMetrics.robotBottlesPerHour}`}
            subValue="bottles"
            accentColor="#8b5cf6"
            delay={0}
          />
          <StatCard
            icon={<Activity size={20} color={colors.success} />}
            label="OEE"
            value={`${(productionMetrics.robotOEE * 100).toFixed(0)}%`}
            accentColor={colors.success}
            delay={100}
          />
          <StatCard
            icon={<CheckCircle size={20} color={colors.success} />}
            label="Defect Rate"
            value={`${productionMetrics.robotDefectRate}/100`}
            subValue="Zero defects!"
            accentColor={colors.success}
            delay={200}
          />
          <StatCard
            icon={<DollarSign size={20} color={colors.accent} />}
            label="Cost/Bottle"
            value={`$${productionMetrics.robotCostPerBottle.toFixed(3)}`}
            accentColor={colors.accent}
            delay={300}
          />
          <StatCard
            icon={<Battery size={20} color={colors.primary} />}
            label="Energy/1K"
            value={`${productionMetrics.robotEnergyPer1000}`}
            subValue="kWh"
            accentColor={colors.primary}
            delay={400}
          />
          <StatCard
            icon={<Users size={20} color={colors.warning} />}
            label="Workers"
            value={`${productionMetrics.robotWorkers}`}
            subValue={`$${productionMetrics.robotLaborCostPerHour}/hr`}
            accentColor={colors.warning}
            delay={500}
          />
        </View>

        <PerformanceChart />
        <UptimeChart />

        <View style={styles.robotsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Robots</Text>
          {robots.map((robot, index) => (
            <RobotCard key={robot.id} robot={robot} index={index} />
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
    marginBottom: 16,
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
  performanceBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  performanceBarWrapper: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  performanceBar: {
    width: 40,
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceLabel: {
    fontSize: 11,
  },
  uptimeCard: {
    marginBottom: 20,
  },
  uptimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  uptimeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  uptimeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  uptimeContent: {
    flexDirection: 'row',
    gap: 20,
  },
  uptimeRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#8b5cf640',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uptimeValue: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  uptimeLabel: {
    fontSize: 11,
  },
  uptimeStats: {
    flex: 1,
    gap: 10,
  },
  uptimeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uptimeStatLabel: {
    width: 40,
    fontSize: 11,
  },
  uptimeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
  },
  uptimeBar: {
    height: '100%',
    borderRadius: 4,
  },
  uptimeStatValue: {
    width: 45,
    fontSize: 12,
    fontWeight: '600' as const,
    textAlign: 'right',
  },
  robotsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  robotCard: {
    marginBottom: 0,
  },
  robotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  robotIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  robotIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotId: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  robotCycles: {
    fontSize: 11,
    marginTop: 2,
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
  robotStats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  robotStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  robotStatDivider: {
    width: 1,
    height: '100%',
  },
  robotStatValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  robotStatLabel: {
    fontSize: 11,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
