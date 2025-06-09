import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(
        validationErrors.map((error) => ({
          [error.property]: error.constraints
            ? Object.values(error.constraints)[0]
            : 'Validation failed',
        })),
      );
    },

  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
