import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class AgentRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>
}