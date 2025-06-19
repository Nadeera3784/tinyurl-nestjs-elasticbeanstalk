import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private connection: Connection) {}

  getHealthStatus() {
    const readyState = Number(this.connection.readyState);
    const isDbConnected = readyState === 1;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: isDbConnected,
        state: this.getConnectionState(readyState),
        host: this.connection.host,
        name: this.connection.name,
      },
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private getConnectionState(state: number): string {
    const connectionStates: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return connectionStates[state] || 'unknown';
  }
}
