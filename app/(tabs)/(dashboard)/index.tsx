import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Activity, TrendingUp, Zap, ShieldCheck, Clock, Sparkles, Battery, Users, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTickets } from '@/contexts/TicketsContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import KPICard from '@/components/KPICard';
import ProductionChart from '@/components/ProductionChart';
import ComparisonCard from '@/components/ComparisonCard';
import DowntimeChart from '@/components/DowntimeChart';
import DefectsChart from '@/components/DefectsChart';
import EnergyChart from '@/components/EnergyChart';
import ActivityFeed from '@/components/ActivityFeed';
import { productionMetrics } from '@/constants/productionData';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { openTicketsCount } = useTickets();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCreateTicket = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/create-ticket');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedBackground />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <HeroSection />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
          <View style={styles.kpiGrid}>
            <KPICard
              title="OEE"
              value={`${(productionMetrics.oee * 100).toFixed(0)}%`}
              icon={<Activity size={20} color={colors.success} />}
              trend={{ value: 2, isPositive: true }}
              accentColor={colors.success}
              showGlow
              delay={0}
            />
            <KPICard
              title="Bottles Today"
              value={productionMetrics.dailyProduction.toLocaleString()}
              subtitle="+5.2% vs yesterday"
              icon={<TrendingUp size={20} color={colors.primary} />}
              accentColor={colors.primary}
              delay={100}
            />
            <KPICard
              title="Bottles/Hour"
              value={productionMetrics.totalBottlesPerHour.toLocaleString()}
              subtitle={`M: ${productionMetrics.machineBottlesPerHour} | R: ${productionMetrics.robotBottlesPerHour}`}
              icon={<Zap size={20} color={colors.warning} />}
              accentColor={colors.warning}
              delay={200}
            />
            <KPICard
              title="Defect Rate"
              value={`${productionMetrics.defectRate}%`}
              subtitle="Target: <2%"
              icon={<ShieldCheck size={20} color={colors.success} />}
              accentColor={colors.success}
              delay={300}
            />
            <KPICard
              title="Downtime Today"
              value={`${productionMetrics.downtime} min`}
              icon={<Clock size={20} color={colors.textSecondary} />}
              delay={400}
            />
            <KPICard
              title="AI Risk Score"
              value={`${(productionMetrics.aiRiskScore * 100).toFixed(0)}%`}
              subtitle="Low Risk"
              icon={<Sparkles size={20} color={colors.success} />}
              accentColor={colors.success}
              showGlow
              delay={500}
            />
            <KPICard
              title="Energy per 1K"
              value={`${productionMetrics.machineEnergyPer1000} kWh`}
              subtitle={`Robotics: ${productionMetrics.robotEnergyPer1000} kWh`}
              icon={<Battery size={20} color={colors.accent} />}
              accentColor={colors.accent}
              delay={600}
            />
            <KPICard
              title="Total Workers"
              value={productionMetrics.totalWorkers}
              subtitle={`M: ${productionMetrics.machineWorkers} | R: ${productionMetrics.robotWorkers}`}
              icon={<Users size={20} color="#8b5cf6" />}
              accentColor="#8b5cf6"
              delay={700}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Production Overview</Text>
          <ProductionChart />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Comparison</Text>
          <ComparisonCard />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Analytics</Text>
          <EnergyChart />
          <DowntimeChart />
          <DefectsChart />
        </View>

        <View style={styles.section}>
          <ActivityFeed />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleCreateTicket}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
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
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
