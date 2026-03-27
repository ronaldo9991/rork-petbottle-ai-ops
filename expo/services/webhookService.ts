import AsyncStorage from '@react-native-async-storage/async-storage';

const WEBHOOK_CONFIG_KEY = 'aquaintel_webhook_config';

export interface WebhookConfig {
  n8nWebhookUrl: string;
  n8nInboundUrl: string;
  apiKey: string;
  enabled: boolean;
}

export interface WebhookTicketPayload {
  ticketRef: string;
  ticketId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  subject: string;
  message: string;
  priority: string;
  ticketUrl: string;
  createdAt: string;
}

export interface InboundMessage {
  ticketRef: string;
  message: string;
  from: string;
  channel: string;
  externalId: string;
  mediaUrl?: string;
  timestamp: string;
}

const defaultConfig: WebhookConfig = {
  n8nWebhookUrl: 'https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created',
  n8nInboundUrl: 'https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound',
  apiKey: '',
  enabled: true,
};

export async function getWebhookConfig(): Promise<WebhookConfig> {
  try {
    const stored = await AsyncStorage.getItem(WEBHOOK_CONFIG_KEY);
    if (stored) {
      return { ...defaultConfig, ...JSON.parse(stored) };
    }
    return defaultConfig;
  } catch (error) {
    console.log('Error loading webhook config:', error);
    return defaultConfig;
  }
}

export async function saveWebhookConfig(config: WebhookConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(WEBHOOK_CONFIG_KEY, JSON.stringify(config));
    console.log('Webhook config saved successfully');
  } catch (error) {
    console.log('Error saving webhook config:', error);
    throw error;
  }
}

export async function sendTicketCreatedWebhook(payload: WebhookTicketPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getWebhookConfig();
    
    if (!config.enabled || !config.n8nWebhookUrl) {
      console.log('Webhook not configured or disabled, skipping...');
      return { success: true };
    }

    console.log('Sending ticket to n8n webhook:', config.n8nWebhookUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['x-api-key'] = config.apiKey;
    }

    const wrappedPayload = { body: payload };
    console.log('Wrapped payload for n8n:', JSON.stringify(wrappedPayload, null, 2));

    const response = await fetch(config.n8nWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(wrappedPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Webhook error response:', errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const result = await response.json().catch(() => ({}));
    console.log('Webhook response:', result);
    return { success: true };
  } catch (error) {
    console.log('Error sending webhook:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendCustomerReplyWebhook(ticketRef: string, message: string, customerPhone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getWebhookConfig();
    
    if (!config.enabled || !config.n8nWebhookUrl) {
      console.log('Webhook not configured or disabled, skipping...');
      return { success: true };
    }

    const payload = {
      type: 'customer_reply',
      ticketRef,
      message,
      customerPhone,
      channel: 'web',
      timestamp: new Date().toISOString(),
    };

    console.log('Sending customer reply to n8n webhook:', payload);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['x-api-key'] = config.apiKey;
    }

    const wrappedPayload = { body: payload };

    const response = await fetch(config.n8nWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(wrappedPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Webhook error response:', errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    console.log('Error sending customer reply webhook:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function receiveInboundMessage(payload: InboundMessage): Promise<{ success: boolean; error?: string }> {
  console.log('📨 Received inbound message:', payload);
  return { success: true };
}

export async function testWebhookConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getWebhookConfig();
    
    if (!config.n8nWebhookUrl) {
      return { success: false, error: 'Webhook URL not configured' };
    }

    const testPayload = {
      type: 'connection_test',
      timestamp: new Date().toISOString(),
      message: 'Testing connection from AquaIntel app',
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['x-api-key'] = config.apiKey;
    }

    const response = await fetch(config.n8nWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
  }
}
