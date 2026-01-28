import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Swagger configuration (single source of truth)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PRYSM Mini CRM API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Paste JWT token here',
      in: 'header',
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument, {
    customSiteTitle: 'Prysm Mini CRM API',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: false, // ✅ removed filter/search box
      displayRequestDuration: true,
    },
    customCss: `
      body {
        background: #ffffff;   /* ✅ pure white */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .swagger-ui .topbar {
        display: none;
      }

      .swagger-ui .info {
        text-align: center;
        margin: 40px 0;
      }

      .swagger-ui .info h1 {
        font-size: 32px;
        font-weight: 700;
        color: #0f172a;
      }

      .swagger-ui .info p {
        color: #475569;
        font-size: 15px;
      }

      .swagger-ui .opblock {
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        margin-bottom: 14px;
      }

      /* ✅ Authorize button contrast */
      .swagger-ui .btn.authorize {
        background-color: #16a34a !important;
        color: #ffffff !important;
        font-weight: 600;
        border-radius: 6px;
      }

      .swagger-ui .btn.authorize svg {
        fill: #ffffff !important;
      }

      /* ✅ Execute button */
      .swagger-ui .btn.execute {
        background-color: #2563eb !important;
        color: #ffffff !important;
        border-radius: 6px;
      }
    `,
  });

  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
  console.log(`Swagger available at http://localhost:3000/api`);
}

bootstrap();
