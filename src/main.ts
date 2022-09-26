import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('APP_PORT'));

  if (process.env.APP_ENV === 'local') {
    console.log(
      `----------\nStart ${configService.get(
        'APP_NAME',
      )} service at http://${configService.get('APP_HOST')}:${configService.get(
        'APP_PORT',
      )}/ ...\n----------\n`,
    );
  }
}
bootstrap();
