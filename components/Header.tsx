import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Sun, Moon, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

export default function Header() {
  const { colors, toggleTheme, isDark } = useTheme();

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <LinearGradient
          colors={['#0EA5E9', '#00d4ff']}
          style={styles.logo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.logoText}>AQ</Text>
        </LinearGradient>
        <Text style={[styles.title, { color: colors.text }]}>AQUAINTEL</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: colors.glass }]}
          onPress={handleThemeToggle}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={20} color={colors.warning} />
          ) : (
            <Moon size={20} color={colors.primary} />
          )}
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#0EA5E9', '#8b5cf6']}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <User size={18} color="#fff" />
          </LinearGradient>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800' as const,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0a0a0f',
  },
});
