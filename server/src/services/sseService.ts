import { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
}

class SSEService {
  private clients: SSEClient[] = [];

  public addClient(id: string, res: Response) {
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

  public removeClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  public broadcast(eventTypeOrPayload: string | Record<string, any>, payload?: any) {
    let data: string;
    if (typeof eventTypeOrPayload === 'object') {
      // Called with single object: sseService.broadcast({ type: ..., ...rest })
      data = JSON.stringify({ ...eventTypeOrPayload, timestamp: new Date().toISOString() });
    } else {
      // Called with two args: sseService.broadcast('EVENT', payload)
      data = JSON.stringify({ type: eventTypeOrPayload, payload, timestamp: new Date().toISOString() });
    }

    this.clients.forEach(client => {
      try {
        client.res.write(`data: ${data}\n\n`);
      } catch (err) {
        // Stale connection
      }
    });
  }
}

export const sseService = new SSEService();
