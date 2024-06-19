import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/root.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  /**
   * Swagger Configs & Options
   */
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const config = new DocumentBuilder()
    .setTitle('Ojembaa Api')
    .setDescription('Api description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;

  app.enableCors({
    origin: '*',
    methods: ['GET', 'PATCH', 'PUT', 'POST', 'OPTIONS'],
  });
  await app.listen(PORT, () => {
    console.log(`NestJS application is running on port ${PORT}`);
  });
}

bootstrap();
