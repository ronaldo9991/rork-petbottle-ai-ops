import { Tabs } from 'expo-router';
import { LayoutDashboard, Ticket, Wrench, Bot } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 8,
          height: 85,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <LayoutDashboard size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(machines)"
        options={{
          title: 'Machines',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Wrench size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(robots)"
        options={{
          title: 'Robots',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Bot size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(tickets)"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Ticket size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
