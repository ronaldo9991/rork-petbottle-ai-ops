import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ticket, TicketPriority, TicketStatus } from '@/contexts/TicketsContext';
import * as Haptics from 'expo-haptics';

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

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

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function TicketCard({ ticket, onPress }: TicketCardProps) {
  const { colors, isDark } = useTheme();
  const priorityColor = priorityColors[ticket.priority];
  const statusColor = statusColors[ticket.status];
  const lastMessage = ticket.messages[ticket.messages.length - 1];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: colors.glass, 
          borderColor: colors.glassBorder,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.ticketRef, { color: colors.accent }]}>
          {ticket.ticketRef}
        </Text>
        <View style={styles.badges}>
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
      </View>

      <Text style={[styles.subject, { color: colors.text }]} numberOfLines={1}>
        {ticket.subject}
      </Text>
      
      <Text style={[styles.customer, { color: colors.textSecondary }]}>
        {ticket.customerName}
      </Text>

      {lastMessage && (
        <View style={styles.messagePreview}>
          <MessageSquare size={14} color={colors.textMuted} />
          <Text 
            style={[styles.previewText, { color: colors.textMuted }]} 
            numberOfLines={1}
          >
            {lastMessage.body}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.time, { color: colors.textMuted }]}>
          {formatTimeAgo(ticket.updatedAt)}
        </Text>
        {ticket.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.danger }]}>
            <Text style={styles.unreadText}>{ticket.unreadCount}</Text>
          </View>
        )}
        {lastMessage?.channel === 'whatsapp' && (
          <Text style={[styles.whatsappBadge, { color: '#25D366' }]}>
            ✓✓ WhatsApp
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketRef: {
    fontSize: 14,
    fontWeight: '700' as const,
    fontFamily: 'monospace',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  customer: {
    fontSize: 13,
    marginBottom: 8,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  time: {
    fontSize: 12,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  whatsappBadge: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
});
