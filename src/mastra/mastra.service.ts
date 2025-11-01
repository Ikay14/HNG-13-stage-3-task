import { Injectable, OnModuleInit } from '@nestjs/common';
import { palindromeAgent } from './agent';
import { Agent } from '@mastra/core/agent';

@Injectable()
export class MastraService implements OnModuleInit {
  private readonly agent: Agent = palindromeAgent

  onModuleInit() {
    console.log("MastraService initialized and using shared Agent")
  }

  async generateResponse(message: string, context?: any): Promise<any> {
    return await this.agent.generate(message, { ...context })
  }
}
