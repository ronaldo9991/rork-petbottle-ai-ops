import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ChevronLeft, Phone, Mail, Send, MessageCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTickets, TicketMessage, TicketPriority, TicketStatus } from '@/contexts/TicketsContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';

const priorityColors: Record<TicketPriority, string> = {
  low: '#6b7280',
  medium: '#0EA5E9',
  high: '#ff9800',
  urgent: '#ff3366',
};

const statusColors: Record<TicketStatus, string> = {
  open: '#0EA5E9',
  in_progress: '#ffb800',
  resolved: '#00ff88',
  closed: '#6b7280',
};

const statusLabels: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function TicketDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTicketById, addMessage, simulateManagerReply, markAsRead } = useTickets();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const ticket = getTicketById(id);

  useEffect(() => {
    if (ticket) {
      markAsRead(ticket.id);
    }
  }, [ticket?.id]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [ticket?.messages.length]);

  if (!ticket) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AnimatedBackground />
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>Ticket not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await addMessage({ ticketId: ticket.id, message: newMessage.trim() });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSimulateReply = async () => {
    if (!ticket) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await simulateManagerReply(ticket.id);
  };

  const renderMessage = (message: TicketMessage, index: number) => {
    const isCustomer = message.sender === 'customer';
    const isWhatsApp = message.channel === 'whatsapp';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isCustomer ? styles.customerMessage : styles.managerMessage,
        ]}
      >
        <View style={[
          styles.messageBubble,
          { 
            backgroundColor: isCustomer 
              ? `${colors.primary}20` 
              : '#25D36620',
          }
        ]}>
          <View style={styles.messageHeader}>
            <Text style={[styles.senderBadge, { color: colors.textMuted }]}>
              {isWhatsApp ? '📱 WhatsApp' : '🌐 Web'}
            </Text>
          </View>
          <Text style={[styles.messageText, { color: colors.text }]}>
            {message.body}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, { color: colors.textMuted }]}>
              {formatTime(message.createdAt)}
            </Text>
            {isWhatsApp && !isCustomer && (
              <Text style={[styles.readReceipt, { color: '#25D366' }]}>✓✓</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const priorityColor = priorityColors[ticket.priority];
  const statusColor = statusColors[ticket.status];

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: ticket.ticketRef,
          headerTitleStyle: { 
            color: colors.text, 
            fontWeight: '700',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={handleSimulateReply}>
              <MessageCircle size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AnimatedBackground />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={90}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 60 }]}
            showsVerticalScrollIndicator={false}
          >
            <GlassCard style={styles.infoCard}>
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: colors.text }]}>
                  {ticket.customerName}
                </Text>
                <View style={styles.contactRow}>
                  <TouchableOpacity style={styles.contactButton}>
                    <Phone size={16} color={colors.primary} />
                    <Text style={[styles.contactText, { color: colors.primary }]}>
                      {ticket.customerPhone}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.contactRow}>
                  <TouchableOpacity style={styles.contactButton}>
                    <Mail size={16} color={colors.primary} />
                    <Text style={[styles.contactText, { color: colors.primary }]}>
                      {ticket.customerEmail}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={[styles.subject, { color: colors.text }]}>{ticket.subject}</Text>
              
              <View style={styles.metaRow}>
                <View style={[styles.badge, { backgroundColor: `${priorityColor}20` }]}>
                  <Text style={[styles.badgeText, { color: priorityColor }]}>
                    {ticket.priority.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${statusColor}20` }]}>
                  <Text style={[styles.badgeText, { color: statusColor }]}>
                    {statusLabels[ticket.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.timestamps}>
                <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                  Created: {formatDate(ticket.createdAt)}
                </Text>
                <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                  Updated: {formatDate(ticket.updatedAt)}
                </Text>
              </View>

              <View style={[styles.whatsappStatus, { backgroundColor: '#25D36610' }]}>
                <Text style={styles.whatsappIcon}>📱</Text>
                <View>
                  <Text style={[styles.whatsappTitle, { color: '#25D366' }]}>
                    Sent to manager via WhatsApp
                  </Text>
                  <Text style={[styles.whatsappSubtitle, { color: colors.textMuted }]}>
                    Manager replied {ticket.messages.filter(m => m.sender === 'manager').length > 0 ? '✓' : 'pending'}
                  </Text>
                </View>
              </View>
            </GlassCard>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Conversation</Text>
            
            <View style={styles.messagesContainer}>
              {ticket.messages.map((message, index) => renderMessage(message, index))}
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={[
            styles.inputBar, 
            { 
              backgroundColor: colors.surface,
              borderTopColor: colors.glassBorder,
              paddingBottom: insets.bottom + 8,
            }
          ]}>
            <View style={[styles.inputContainer, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Type your reply..."
                placeholderTextColor={colors.textMuted}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={5000}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { 
                    backgroundColor: newMessage.trim() ? colors.primary : colors.glass,
                    opacity: newMessage.trim() ? 1 : 0.5,
                  }
                ]}
                onPress={handleSend}
                disabled={!newMessage.trim() || sending}
              >
                <Send size={20} color={newMessage.trim() ? '#fff' : colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
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
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  infoCard: {
    marginBottom: 20,
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  contactRow: {
    marginBottom: 6,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  subject: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  timestamps: {
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 2,
  },
  whatsappStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  whatsappIcon: {
    fontSize: 24,
  },
  whatsappTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  whatsappSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  messagesContainer: {
    gap: 12,
  },
  messageContainer: {
    maxWidth: '85%',
  },
  customerMessage: {
    alignSelf: 'flex-start',
  },
  managerMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageHeader: {
    marginBottom: 4,
  },
  senderBadge: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  messageTime: {
    fontSize: 11,
  },
  readReceipt: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
