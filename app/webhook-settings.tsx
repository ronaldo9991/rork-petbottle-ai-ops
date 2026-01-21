import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Webhook, Key, Link, CheckCircle, XCircle, RefreshCw, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  getWebhookConfig, 
  saveWebhookConfig, 
  testWebhookConnection,
  WebhookConfig 
} from '@/services/webhookService';

export default function WebhookSettingsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [config, setConfig] = useState<WebhookConfig>({
    n8nWebhookUrl: '',
    n8nInboundUrl: '',
    apiKey: '',
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const stored = await getWebhookConfig();
      setConfig(stored);
    } catch (error) {
      console.log('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await saveWebhookConfig(config);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Webhook settings saved successfully!');
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!config.n8nWebhookUrl) {
      Alert.alert('Error', 'Please enter a webhook URL first.');
      return;
    }

    setTesting(true);
    setTestResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await saveWebhookConfig({ ...config, enabled: true });
      const result = await testWebhookConnection();
      
      if (result.success) {
        setTestResult('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setTestResult('error');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Connection Failed', result.error || 'Could not connect to webhook.');
      }
    } catch (error) {
      setTestResult('error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Connection test failed.');
    } finally {
      setTesting(false);
    }
  };

  const renderInput = (
    icon: React.ReactNode,
    label: string,
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    secureTextEntry?: boolean
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
        <View style={[styles.inputIcon, { backgroundColor: colors.glassStrong }]}>
          {icon}
        </View>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'Webhook Settings',
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
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 60 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.infoCard, { backgroundColor: `${colors.primary}15` }]}>
            <Info size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>n8n Integration (Outbound Only)</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                When a ticket is created, it will be sent to your n8n webhook. n8n can then forward it to WhatsApp, email, or any other service.{"\n\n"}
                Note: To receive manager replies back into the app, you need a backend server (Firebase, Supabase, or custom API).
              </Text>
            </View>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Webhook size={20} color={colors.primary} />
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Enable Webhook</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  { backgroundColor: config.enabled ? colors.success : colors.glass }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setConfig({ ...config, enabled: !config.enabled });
                }}
              >
                <View style={[
                  styles.toggleKnob,
                  { 
                    backgroundColor: '#fff',
                    transform: [{ translateX: config.enabled ? 20 : 0 }]
                  }
                ]} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {renderInput(
              <Link size={18} color={colors.primary} />,
              'n8n Webhook URL',
              config.n8nWebhookUrl,
              (text) => setConfig({ ...config, n8nWebhookUrl: text }),
              'https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created'
            )}

            {renderInput(
              <Key size={18} color={colors.warning} />,
              'API Key (Optional)',
              config.apiKey,
              (text) => setConfig({ ...config, apiKey: text }),
              'Your shared secret key',
              true
            )}
          </GlassCard>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
              onPress={handleTest}
              disabled={testing}
            >
              {testing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : testResult === 'success' ? (
                <CheckCircle size={20} color={colors.success} />
              ) : testResult === 'error' ? (
                <XCircle size={20} color={colors.danger} />
              ) : (
                <RefreshCw size={20} color={colors.primary} />
              )}
              <Text style={[styles.testButtonText, { color: colors.text }]}>
                {testing ? 'Testing...' : 'Test Connection'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0EA5E9', '#00d4ff']}
              style={styles.saveGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save Settings</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <GlassCard style={styles.helpCard}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>How it works</Text>
            
            <View style={styles.helpStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Create Ticket</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  Customer creates a support ticket in the app
                </Text>
              </View>
            </View>

            <View style={styles.helpStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Webhook Triggered</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  Ticket data is sent to n8n webhook URL
                </Text>
              </View>
            </View>

            <View style={styles.helpStep}>
              <View style={[styles.stepNumber, { backgroundColor: '#25D366' }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>WhatsApp Notification</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  n8n sends notification to manager via WhatsApp
                </Text>
              </View>
            </View>

            <View style={styles.helpStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Simulate Replies (For Testing)</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  Tap the message icon in ticket details to simulate a manager reply
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.webhookExampleCard}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>Webhook Payload Example</Text>
            <View style={[styles.codeBlock, { backgroundColor: colors.glassStrong }]}>
              <Text style={[styles.codeText, { color: colors.textSecondary }]}>
{`{
  "ticketRef": "T-20250115-1234",
  "ticketId": "abc123",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Issue",
  "message": "I need help...",
  "priority": "high",
  "ticketUrl": "https://...",
  "createdAt": "2025-01-15T10:30:00Z"
}`}
              </Text>
            </View>
          </GlassCard>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    gap: 12,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    alignItems: 'center',
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
    fontSize: 14,
  },
  buttonRow: {
    marginBottom: 16,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  helpCard: {
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  webhookExampleCard: {
    marginBottom: 16,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 10,
  },
  codeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
