import { Controller, Get, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { AgentResponseDto } from './dto/agent-response.dto';
import { AgentRequestDto } from './dto/agent-request.dto';


@Controller('a2a/agent')
export class AppController {
  constructor(private readonly appService: AppService) {}

 @Post('palindromeCheckerAgent')
  async handleAgentRequest(
    @Body() request: AgentRequestDto,
  ): Promise<AgentResponseDto> {
    try {
      return await this.appService.processMessage(request);
    } catch (error) {
      console.error('Error processing agent request:', error)
      throw new HttpException(
        {
          error: 'Failed to process request',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      agent: 'palindromeCheckerAgent',
    };
  }
}
