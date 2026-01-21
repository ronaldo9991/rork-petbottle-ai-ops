import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
}

export default function AnimatedBackground() {
  const { colors, isDark } = useTheme();
  const particles = useRef<Particle[]>([]);
  
  useEffect(() => {
    particles.current = Array.from({ length: 15 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.1),
      size: Math.random() * 4 + 2,
    }));

    particles.current.forEach((particle) => {
      const animateParticle = () => {
        const duration = 8000 + Math.random() * 4000;
        
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.6 + 0.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateParticle());
      };
      
      animateParticle();
    });
  }, []);

  const gradientColors = isDark 
    ? ['#0a0a0f', '#0f1020', '#1a1a2e', '#0a0a0f'] as const
    : ['#f8fafc', '#e2e8f0', '#f1f5f9', '#f8fafc'] as const;

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {particles.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: isDark ? colors.accent : colors.primary,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
});
