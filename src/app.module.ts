import { Module } from '@nestjs/common';
import { CompetitionsModule } from './competitions/competitions.module';

@Module({
  imports: [CompetitionsModule],
})
export class AppModule {}
