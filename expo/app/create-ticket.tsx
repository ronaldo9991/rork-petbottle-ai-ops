import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { User, Phone, Mail, FileText, MessageSquare, Send, Info, ChevronLeft, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTickets, TicketPriority } from '@/contexts/TicketsContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

const priorities: { label: string; value: TicketPriority; color: string }[] = [
  { label: 'Low', value: 'low', color: '#6b7280' },
  { label: 'Medium', value: 'medium', color: '#0EA5E9' },
  { label: 'High', value: 'high', color: '#ff9800' },
  { label: 'Urgent', value: 'urgent', color: '#ff3366' },
];

export default function CreateTicketScreen() {
  const { colors } = useTheme();
  const { createTicket, isCreating } = useTickets();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    subject: '',
    message: '',
    priority: 'medium' as TicketPriority,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.customerName.trim() || form.customerName.length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }
    if (!form.customerPhone.trim() || !/^\+?[\d\s-]{8,}$/.test(form.customerPhone)) {
      newErrors.customerPhone = 'Enter a valid phone number';
    }
    if (!form.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      newErrors.customerEmail = 'Enter a valid email address';
    }
    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!form.message.trim() || form.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log('🎫 Creating ticket with form data:', form);
      
      const ticket = await createTicket(form);
      
      console.log('✅ Ticket created successfully:', ticket.ticketRef);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '✅ Ticket Created',
        `Ticket ${ticket.ticketRef} has been created!\n\nWhatsApp should have opened to send the message to the manager at +919655716000.\n\nIf WhatsApp didn't open, please check if it's installed on your device.`,
        [
          { 
            text: 'View Tickets', 
            onPress: () => {
              router.back();
              router.push('/(tabs)/(tickets)');
            }
          },
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      Alert.alert(
        '❌ Error',
        `Failed to create ticket: ${errorMessage}\n\nPlease make sure WhatsApp is installed on your device.`,
        [
          { text: 'Try Again', style: 'default' },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const renderInput = (
    icon: React.ReactNode,
    label: string,
    field: keyof typeof form,
    placeholder: string,
    options?: { multiline?: boolean; keyboardType?: 'default' | 'email-address' | 'phone-pad'; maxLength?: number }
  ) => {
    const error = errors[field];
    
    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <View style={[
          styles.inputContainer, 
          { 
            backgroundColor: colors.glass, 
            borderColor: error ? colors.danger : colors.glassBorder,
          }
        ]}>
          <View style={[styles.inputIcon, { backgroundColor: colors.glassStrong }]}>
            {icon}
          </View>
          <TextInput
            style={[
              styles.input, 
              { color: colors.text },
              options?.multiline && styles.multilineInput
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            value={form[field] as string}
            onChangeText={(text) => {
              setForm({ ...form, [field]: text });
              if (errors[field]) {
                setErrors({ ...errors, [field]: '' });
              }
            }}
            multiline={options?.multiline}
            numberOfLines={options?.multiline ? 4 : 1}
            keyboardType={options?.keyboardType}
            maxLength={options?.maxLength}
            textAlignVertical={options?.multiline ? 'top' : 'center'}
          />
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={14} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          </View>
        )}
        {options?.maxLength && (
          <Text style={[styles.charCount, { color: colors.textMuted }]}>
            {(form[field] as string).length}/{options.maxLength}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'New Support Ticket',
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AnimatedBackground />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 60 }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              We&apos;ll notify the manager via WhatsApp
            </Text>

            <GlassCard style={styles.formCard}>
              {renderInput(
                <User size={18} color={colors.primary} />,
                'Customer Name',
                'customerName',
                'Enter your full name'
              )}

              {renderInput(
                <Phone size={18} color={colors.primary} />,
                'Phone Number',
                'customerPhone',
                '+1234567890',
                { keyboardType: 'phone-pad' }
              )}

              {renderInput(
                <Mail size={18} color={colors.primary} />,
                'Email Address',
                'customerEmail',
                'your@email.com',
                { keyboardType: 'email-address' }
              )}

              {renderInput(
                <FileText size={18} color={colors.primary} />,
                'Subject',
                'subject',
                'Brief description of your issue',
                { maxLength: 200 }
              )}

              {renderInput(
                <MessageSquare size={18} color={colors.primary} />,
                'Message',
                'message',
                'Describe your issue in detail...',
                { multiline: true, maxLength: 5000 }
              )}

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {priorities.map((priority) => {
                    const isSelected = form.priority === priority.value;
                    return (
                      <TouchableOpacity
                        key={priority.value}
                        style={[
                          styles.priorityChip,
                          { 
                            backgroundColor: isSelected ? `${priority.color}20` : colors.glass,
                            borderColor: isSelected ? priority.color : colors.glassBorder,
                          }
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setForm({ ...form, priority: priority.value });
                        }}
                      >
                        <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
                        <Text style={[
                          styles.priorityText,
                          { color: isSelected ? priority.color : colors.textSecondary }
                        ]}>
                          {priority.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </GlassCard>

            <View style={[styles.infoCard, { backgroundColor: `${colors.primary}15` }]}>
              <Info size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Creating this ticket will open WhatsApp to send a message directly to the manager at:
                </Text>
                <Text style={[styles.infoText, { color: colors.primary, fontWeight: '700' as const, marginTop: 4 }]}>
                  +919655716000
                </Text>
                <Text style={[styles.infoTextSmall, { color: colors.textMuted, marginTop: 6 }]}>
                  Make sure WhatsApp is installed on your device.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isCreating}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0EA5E9', '#00d4ff']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isCreating ? (
                  <Text style={styles.submitText}>Creating ticket...</Text>
                ) : (
                  <>
                    <Text style={styles.submitText}>Create Ticket & Notify Manager</Text>
                    <Send size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inputIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 14,
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  infoTextSmall: {
    fontSize: 11,
    lineHeight: 16,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
