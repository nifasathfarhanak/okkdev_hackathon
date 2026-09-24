import { describe, it, expect } from 'vitest';
import { A2AService } from '../integrations/okx/a2a';

describe('A2A Protocol Formatter & Validator', () => {
  const a2a = new A2AService();

  it('should format valid structured A2A messages with headers', () => {
    const msg = a2a.formatMessage(
      'REQUEST_QUOTE',
      'agent-buyer-01',
      'agent-precisionlab-02',
      { product: 'Laboratory Reactor', quantity: 100, budget: 10000 }
    );

    expect(msg.header.protocolVersion).toBe('1.0');
    expect(msg.header.senderAgentId).toBe('agent-buyer-01');
    expect(msg.messageType).toBe('REQUEST_QUOTE');
    expect(msg.payload.budget).toBe(10000);

    const validation = a2a.validateMessage(msg);
    expect(validation.valid).toBe(true);
  });
});
