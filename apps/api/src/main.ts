import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from '../config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors(appConfig.cors);
  
  const port = appConfig.port;
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }
  ));
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 API is running on: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🌐 Environment: ${appConfig.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${appConfig.frontendUrl}`);
}
bootstrap();
