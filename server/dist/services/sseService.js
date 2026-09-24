"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseService = void 0;
class SSEService {
    clients = [];
    addClient(id, res) {
        this.clients.push({ id, res });
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId: id, timestamp: new Date().toISOString() })}\n\n`);
        // Keepalive ping every 25 seconds
        const interval = setInterval(() => {
            res.write(': keepalive\n\n');
        }, 25000);
        res.on('close', () => {
            clearInterval(interval);
            this.removeClient(id);
        });
    }
    removeClient(id) {
        this.clients = this.clients.filter(c => c.id !== id);
    }
    broadcast(eventTypeOrPayload, payload) {
        let data;
        if (typeof eventTypeOrPayload === 'object') {
            // Called with single object: sseService.broadcast({ type: ..., ...rest })
            data = JSON.stringify({ ...eventTypeOrPayload, timestamp: new Date().toISOString() });
        }
        else {
            // Called with two args: sseService.broadcast('EVENT', payload)
            data = JSON.stringify({ type: eventTypeOrPayload, payload, timestamp: new Date().toISOString() });
        }
        this.clients.forEach(client => {
            try {
                client.res.write(`data: ${data}\n\n`);
            }
            catch (err) {
                // Stale connection
            }
        });
    }
}
exports.sseService = new SSEService();
