import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Linking } from 'react-native';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'manager';
  channel: 'web' | 'whatsapp';
  body: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketRef: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
}

export interface CreateTicketData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  subject: string;
  message: string;
  priority: TicketPriority;
}

const TICKETS_STORAGE_KEY = 'aquaintel_tickets';

const generateTicketRef = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `T-${dateStr}-${random}`;
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const MANAGER_WHATSAPP = '919655716000';

const formatWhatsAppMessage = (ticket: Ticket, message: string) => {
  const priorityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    urgent: '🔴',
  };
  
  const text = `🆕 New Support Ticket

Ref: ${ticket.ticketRef}
From: ${ticket.customerName} (${ticket.customerPhone})
Email: ${ticket.customerEmail}
Priority: ${priorityEmoji[ticket.priority]} ${ticket.priority.toUpperCase()}
Subject: ${ticket.subject}

Message:
${message}

Reply format:
${ticket.ticketRef}: <your reply>`;
  
  return encodeURIComponent(text);
};

const sendWhatsAppMessage = async (ticket: Ticket, message: string) => {
  try {
    const formattedMessage = formatWhatsAppMessage(ticket, message);
    const whatsappUrl = `https://wa.me/${MANAGER_WHATSAPP}?text=${formattedMessage}`;
    
    console.log('📱 Opening WhatsApp for ticket:', ticket.ticketRef);
    console.log('📱 Manager number:', MANAGER_WHATSAPP);
    console.log('📱 WhatsApp URL:', whatsappUrl);
    
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    console.log('📱 Can open WhatsApp:', canOpen);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      console.log('✅ WhatsApp opened successfully');
      return { success: true };
    } else {
      console.warn('⚠️ Cannot open WhatsApp - app not installed');
      return { success: false, error: 'WhatsApp is not installed on this device' };
    }
  } catch (error) {
    console.error('❌ Error opening WhatsApp:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to open WhatsApp' };
  }
};

const sampleTickets: Ticket[] = [
  {
    id: generateId(),
    ticketRef: 'T-20250115-1234',
    subject: 'Product Quality Issue',
    status: 'open',
    priority: 'high',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    customerEmail: 'john@example.com',
    messages: [
      {
        id: generateId(),
        sender: 'customer',
        channel: 'web',
        body: 'I received damaged bottles in my last order. The bottles have cracks and are unusable.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: generateId(),
        sender: 'manager',
        channel: 'whatsapp',
        body: 'Thank you for reporting this issue. We\'ll investigate immediately and get back to you.',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    unreadCount: 1,
  },
  {
    id: generateId(),
    ticketRef: 'T-20250115-5678',
    subject: 'Delivery Delay',
    status: 'in_progress',
    priority: 'medium',
    customerName: 'Jane Smith',
    customerPhone: '+0987654321',
    customerEmail: 'jane@example.com',
    messages: [
      {
        id: generateId(),
        sender: 'customer',
        channel: 'web',
        body: 'My order was supposed to arrive yesterday but I haven\'t received any updates.',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
  },
  {
    id: generateId(),
    ticketRef: 'T-20250114-9012',
    subject: 'Billing Inquiry',
    status: 'resolved',
    priority: 'low',
    customerName: 'Bob Wilson',
    customerPhone: '+1122334455',
    customerEmail: 'bob@example.com',
    messages: [
      {
        id: generateId(),
        sender: 'customer',
        channel: 'web',
        body: 'I have a question about my last invoice.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: generateId(),
        sender: 'manager',
        channel: 'whatsapp',
        body: 'We\'ve reviewed your invoice and everything looks correct. Let me know if you have any other questions.',
        createdAt: new Date(Date.now() - 72000000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 72000000).toISOString(),
    unreadCount: 0,
  },
];

export const [TicketsProvider, useTickets] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const ticketsQuery = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as Ticket[];
        }
        await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(sampleTickets));
        return sampleTickets;
      } catch (error) {
        console.log('Error loading tickets:', error);
        return sampleTickets;
      }
    },
  });

  const saveTickets = async (tickets: Ticket[]) => {
    await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  };

  const createTicketMutation = useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const tickets = ticketsQuery.data || [];
      const ticketId = generateId();
      const ticketRef = generateTicketRef();
      const createdAt = new Date().toISOString();
      
      const newTicket: Ticket = {
        id: ticketId,
        ticketRef,
        subject: data.subject,
        status: 'open',
        priority: data.priority,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        messages: [
          {
            id: generateId(),
            sender: 'customer',
            channel: 'web',
            body: data.message,
            createdAt,
          },
        ],
        createdAt,
        updatedAt: createdAt,
        unreadCount: 0,
      };
      
      const updated = [newTicket, ...tickets];
      await saveTickets(updated);

      console.log('✅ Ticket created:', ticketRef);
      console.log('📤 Sending to WhatsApp...');
      
      const whatsappResult = await sendWhatsAppMessage(newTicket, data.message);
      console.log('📱 WhatsApp result:', whatsappResult);
      
      if (!whatsappResult.success) {
        console.warn('⚠️ Failed to open WhatsApp:', whatsappResult.error);
        throw new Error(whatsappResult.error || 'Failed to open WhatsApp');
      }
      
      console.log('✅ Ticket created and sent to WhatsApp successfully');
      return newTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      const tickets = ticketsQuery.data || [];
      let ticketRef = '';
      
      const updated = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          ticketRef = ticket.ticketRef;
          return {
            ...ticket,
            messages: [
              ...ticket.messages,
              {
                id: generateId(),
                sender: 'customer' as const,
                channel: 'web' as const,
                body: message,
                createdAt: new Date().toISOString(),
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return ticket;
      });
      await saveTickets(updated);

      if (ticketRef) {
        const ticket = tickets.find(t => t.ticketRef === ticketRef);
        if (ticket) {
          const whatsappResult = await sendWhatsAppMessage(ticket, message);
          console.log('Customer reply WhatsApp result:', whatsappResult);
        }
      }
      
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: TicketStatus }) => {
      const tickets = ticketsQuery.data || [];
      const updated = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return { ...ticket, status, updatedAt: new Date().toISOString() };
        }
        return ticket;
      });
      await saveTickets(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const filteredTickets = (ticketsQuery.data || []).filter((ticket) => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      ticket.ticketRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getTicketByRef = useCallback((ref: string) => {
    return (ticketsQuery.data || []).find((t) => t.ticketRef === ref);
  }, [ticketsQuery.data]);

  const getTicketById = useCallback((id: string) => {
    return (ticketsQuery.data || []).find((t) => t.id === id);
  }, [ticketsQuery.data]);

  const openTicketsCount = (ticketsQuery.data || []).filter((t) => t.status === 'open').length;

  const simulateManagerReply = useCallback(async (ticketId: string) => {
    const tickets = ticketsQuery.data || [];
    const updated = tickets.map((ticket) => {
      if (ticket.id === ticketId) {
        const replies = [
          'Thank you for your message. We\'re looking into this.',
          'We\'ve received your ticket and will respond within 24 hours.',
          'Our team is investigating this issue. We\'ll update you soon.',
          'Thank you for contacting us. A specialist will reach out shortly.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              id: generateId(),
              sender: 'manager' as const,
              channel: 'whatsapp' as const,
              body: randomReply,
              createdAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
          unreadCount: ticket.unreadCount + 1,
        };
      }
      return ticket;
    });
    await saveTickets(updated);
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  }, [ticketsQuery.data, queryClient]);

  const refreshMessages = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['tickets'] });
    return true;
  }, [queryClient]);

  const markAsRead = useCallback(async (ticketId: string) => {
    const tickets = ticketsQuery.data || [];
    const updated = tickets.map((ticket) => {
      if (ticket.id === ticketId && ticket.unreadCount > 0) {
        return { ...ticket, unreadCount: 0 };
      }
      return ticket;
    });
    await saveTickets(updated);
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  }, [ticketsQuery.data, queryClient]);

  return {
    tickets: ticketsQuery.data || [],
    filteredTickets,
    isLoading: ticketsQuery.isLoading,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    createTicket: createTicketMutation.mutateAsync,
    isCreating: createTicketMutation.isPending,
    addMessage: addMessageMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    getTicketByRef,
    getTicketById,
    openTicketsCount,
    refreshMessages,
    markAsRead,
    simulateManagerReply,
  };
});
