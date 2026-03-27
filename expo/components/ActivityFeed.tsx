import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wrench, Ticket, CheckCircle, Calendar, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from './GlassCard';
import { recentActivities } from '@/constants/productionData';

const getActivityIcon = (type: string, colors: any) => {
  const iconSize = 16;
  switch (type) {
    case 'maintenance':
      return <Wrench size={iconSize} color={colors.primary} />;
    case 'ticket':
      return <Ticket size={iconSize} color={colors.warning} />;
    case 'quality':
      return <CheckCircle size={iconSize} color={colors.success} />;
    case 'schedule':
      return <Calendar size={iconSize} color="#8b5cf6" />;
    case 'alert':
      return <AlertTriangle size={iconSize} color={colors.danger} />;
    default:
      return <CheckCircle size={iconSize} color={colors.textSecondary} />;
  }
};

export default function ActivityFeed() {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Activity</Text>
      
      <View style={styles.feed}>
        {recentActivities.map((activity, index) => (
          <View key={activity.id} style={styles.activityRow}>
            <View style={[styles.timeline, { backgroundColor: colors.glassBorder }]}>
              <View style={[styles.dot, { backgroundColor: colors.glass, borderColor: colors.primary }]}>
                {getActivityIcon(activity.type, colors)}
              </View>
              {index < recentActivities.length - 1 && (
                <View style={[styles.line, { backgroundColor: colors.glassBorder }]} />
              )}
            </View>
            <View style={styles.content}>
              <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
                {activity.message}
              </Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>{activity.time}</Text>
            </View>
          </View>
        ))}
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
  feed: {
    gap: 0,
  },
  activityRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timeline: {
    width: 40,
    alignItems: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -4,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
});
