import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT);
  console.log(`🤖 Mastra Agent Server running on port ${PORT}`);
  console.log(`📡 A2A Endpoint: http://localhost:${PORT}/a2a`);
}
bootstrap();
