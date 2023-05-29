import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.setGlobalPrefix('v1');
  app.enableCors();
  const port = process.env.NEST_PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Notification Service')
    .setDescription('Microservice for notification')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global pipe
  // whitelist: removes all properties of a request’s body which are not in the DTO
  // transform: this property would allow us to transform properties, for instance, an integer to a string
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
  Logger.log(`API document: ${await app.getUrl()}/api`);
}
bootstrap();
