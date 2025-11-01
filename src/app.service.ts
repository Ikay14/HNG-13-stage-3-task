import { Injectable } from '@nestjs/common';
import { MastraService } from './mastra/mastra.service';
import { AgentResponseDto } from './dto/agent-response.dto';
import { AgentRequestDto } from './dto/agent-request.dto';


@Injectable()
export class AppService {
constructor(private readonly mastraService: MastraService) {}
async processMessage(request: AgentRequestDto): Promise<AgentResponseDto> {
    const { message, context } = request;

    // Get the agent response from Mastra
    const response = await this.mastraService.generateResponse(
      message,
      context,
    );

    return {
      response: response.text,
      timestamp: new Date().toISOString(),
      agentId: 'palindromeCheckerAgent',
    };
  }
}
