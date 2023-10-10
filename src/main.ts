import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RedisStorage, client } from './redis/RedisStorage';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await client.connect();
  app.enableCors({
    credentials: true,
    methods: ["POST", "GET"],
    origin: process.env.CLIENT_URL
  })
  app.use(cookieParser())
  app.use(session({
    name: 'Mitgram_sid',
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET_KEY,
    store: RedisStorage,
    cookie: {
      maxAge: 1000 * 3600 * 24
    }
  }))
  await app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Mitgram Server start: ${process.env.HOST}:${process.env.PORT}`);
  });
}
bootstrap();