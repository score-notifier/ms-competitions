import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';

@Module({
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  imports: [NatsModule],
})
export class CompetitionsModule {}
