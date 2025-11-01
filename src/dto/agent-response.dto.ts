import { IsString } from 'class-validator'

export class AgentResponseDto {
  @IsString()
  response: string;
  timestamp: string;
  agentId: string;
}