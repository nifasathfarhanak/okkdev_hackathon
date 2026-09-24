"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const a2a_1 = require("../integrations/okx/a2a");
(0, vitest_1.describe)('A2A Protocol Formatter & Validator', () => {
    const a2a = new a2a_1.A2AService();
    (0, vitest_1.it)('should format valid structured A2A messages with headers', () => {
        const msg = a2a.formatMessage('REQUEST_QUOTE', 'agent-buyer-01', 'agent-precisionlab-02', { product: 'Laboratory Reactor', quantity: 100, budget: 10000 });
        (0, vitest_1.expect)(msg.header.protocolVersion).toBe('1.0');
        (0, vitest_1.expect)(msg.header.senderAgentId).toBe('agent-buyer-01');
        (0, vitest_1.expect)(msg.messageType).toBe('REQUEST_QUOTE');
        (0, vitest_1.expect)(msg.payload.budget).toBe(10000);
        const validation = a2a.validateMessage(msg);
        (0, vitest_1.expect)(validation.valid).toBe(true);
    });
});
