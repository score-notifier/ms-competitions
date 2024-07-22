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
import { CreateTeamDto, CreateLeagueDto } from './dto';
import { CreateMatchDto } from './dto';

@Injectable()
export class CompetitionsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CompetitionsService.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async createTeams(createTeamDtoList: CreateTeamDto[]) {
    try {
      this.logger.log('Creating new teams', createTeamDtoList);

      for (const createTeamDto of createTeamDtoList) {
        const { name, leagueId, liveScoreURL } = createTeamDto;

        const leagueExists = await this.league.findUnique({
          where: { id: leagueId },
        });

        if (!leagueExists) {
          throw new RpcException({
            message: `League with ID ${leagueId} does not exist`,
          });
        }

        await this.team.upsert({
          where: { name },
          update: {
            leagueId,
            liveScoreURL,
          },
          create: {
            name,
            leagueId,
            liveScoreURL,
          },
        });
      }

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('Error creating teams', error, createTeamDtoList);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async createMatches(createMatchDtoList: CreateMatchDto[]) {
    this.logger.log('Creating new matches', createMatchDtoList.length);
    try {
      await this.$transaction(async (prisma) => {
        const promises = createMatchDtoList.map(async (createMatchDto) => {
          const [homeTeam, awayTeam, league] = await Promise.all([
            prisma.team.findUnique({
              where: { name: createMatchDto.homeTeam },
            }),
            prisma.team.findUnique({
              where: { name: createMatchDto.awayTeam },
            }),
            prisma.league.findUnique({
              where: { id: createMatchDto.leagueId },
            }),
          ]);

          if (!awayTeam || !homeTeam || !league) {
            this.logger.warn('League, home team or away team does not exist', {
              homeTeam: homeTeam ? homeTeam.name : 'null',
              awayTeam: awayTeam ? awayTeam.name : 'null',
              league: league ? league.name : createMatchDto.leagueId,
            });
            return;
          }

          await prisma.match.upsert({
            where: { liveScoreURL: createMatchDto.liveScoreURL },
            update: { result: createMatchDto.result },
            create: {
              homeTeam: { connect: { id: homeTeam.id } },
              awayTeam: { connect: { id: awayTeam.id } },
              league: { connect: { id: league.id } },
              date: createMatchDto.date,
              time: createMatchDto.time,
              UTCDate: createMatchDto.UTCDate,
              liveScoreURL: createMatchDto.liveScoreURL,
              result: createMatchDto.result,
            },
          });
        });

        await Promise.all(promises);
      });
    } catch (error) {
      this.logger.error('Error creating matches', error, createMatchDtoList);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async createLeagues(createLeagueDtoList: CreateLeagueDto[]) {
    try {
      this.logger.log('Creating new leagues', createLeagueDtoList);

      for (const createLeagueDto of createLeagueDtoList) {
        const { name, liveScoreURL, country } = createLeagueDto;

        await this.league.upsert({
          where: { liveScoreURL },
          update: {
            name,
            country,
          },
          create: {
            name,
            country,
            liveScoreURL,
          },
        });
      }

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('Error creating leagues', error, createLeagueDtoList);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getLeagues() {
    try {
      return this.league.findMany();
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getLeagueByScoreLiveURL(liveScoreURL: string) {
    try {
      return this.league.findUnique({
        where: { liveScoreURL },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getTeamByScoreLiveURL(liveScoreURL: string) {
    try {
      return this.team.findFirst({
        where: { liveScoreURL },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getTeamByName(teamName: string) {
    try {
      return this.team.findUnique({
        where: { name: teamName },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getLeagueById(leagueId: string) {
    try {
      return this.league.findUnique({
        where: { id: leagueId },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getTeamById(teamId: string) {
    try {
      return this.team.findUnique({
        where: { id: teamId },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getTeams(leagueId: string) {
    try {
      return this.team.findMany({
        where: { leagueId },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getMatches(leagueId: string, teamId: string) {
    try {
      return this.match.findMany({
        where: {
          leagueId,
          OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async getUpcomingMatches(leagueId: string, teamId: string) {
    try {
      return this.match.findMany({
        where: {
          leagueId,
          OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
          UTCDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          UTCDate: 'asc',
        },
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async checkLeagueExists(leagueId: string): Promise<{ exists: boolean }> {
    try {
      const league = await this.league.findUnique({
        where: { id: leagueId },
      });
      return { exists: !!league };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async checkTeamExists(teamId: string): Promise<{ exists: boolean }> {
    try {
      const team = await this.team.findUnique({
        where: { id: teamId },
      });
      return { exists: !!team };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
