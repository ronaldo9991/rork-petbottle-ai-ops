import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

interface QuickActionCardProps {
  title: string;
  count: string;
  status?: string;
  icon: React.ReactNode;
  onPress: () => void;
  hasAlert?: boolean;
}

export default function QuickActionCard({
  title,
  count,
  status,
  icon,
  onPress,
  hasAlert = false,
}: QuickActionCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        {icon}
        {hasAlert && <View style={[styles.alertDot, { backgroundColor: colors.danger }]} />}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.count, { color: colors.textSecondary }]}>{count}</Text>
      {status && (
        <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  alertDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 4,
    textAlign: 'center',
  },
  count: {
    fontSize: 11,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
});
