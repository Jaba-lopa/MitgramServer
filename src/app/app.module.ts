import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}