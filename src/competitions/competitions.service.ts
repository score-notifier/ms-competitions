import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class CompetitionsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CompetitionsService.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
    await this.createFakeLeague();
  }

  async createTeams(createTeamDtoList: CreateTeamDto[]) {
    try {
      this.logger.log('Creating new teams', createTeamDtoList);

      for (const createTeamDto of createTeamDtoList) {
        const { name, leagueId, liveScoreId } = createTeamDto;

        const leagueExists = await this.league.findUnique({
          where: { id: leagueId },
        });

        if (!leagueExists) {
          throw new RpcException({
            message: `League with ID ${leagueId} does not exist`,
          });
        }

        await this.team.upsert({
          where: { liveScoreId },
          update: {
            name,
            leagueId,
          },
          create: {
            id: undefined,
            liveScoreId,
            name,
            leagueId,
          },
        });
      }
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async checkLeagueExists(leagueId: string): Promise<{ exists: boolean }> {
    const league = await this.league.findUnique({
      where: { id: leagueId },
    });
    return { exists: !!league };
  }

  async checkTeamExists(teamId: string): Promise<{ exists: boolean }> {
    const team = await this.team.findUnique({
      where: { id: teamId },
    });
    return { exists: !!team };
  }

  // This is a fake league that will be used to create teams,
  // since the league IDs logic is not available at this moment
  private async createFakeLeague() {
    const fakeLeagueId = '15ed7a50-db72-4f13-afbc-af4268b492bc';
    const fakeLeagueName = 'Fake League';

    const league = await this.league.findUnique({
      where: { id: fakeLeagueId },
    });

    if (!league) {
      await this.league.create({
        data: {
          id: fakeLeagueId,
          name: fakeLeagueName,
        },
      });
      this.logger.log(`Fake league created with ID ${fakeLeagueId}`);
    } else {
      this.logger.log(`Fake league already exists with ID ${fakeLeagueId}`);
    }
  }
}
