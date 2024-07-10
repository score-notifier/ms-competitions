import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompetitionsService } from './competitions.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @MessagePattern('competitions.teams.create')
  async createTeams(@Payload() createTeamDtoList: CreateTeamDto[]) {
    return this.competitionsService.createTeams(createTeamDtoList);
  }

  @MessagePattern('competitions.league.exists')
  async checkLeagueExists(@Payload() data: { leagueId: string }) {
    return this.competitionsService.checkLeagueExists(data.leagueId);
  }

  @MessagePattern('competitions.team.exists')
  async checkTeamExists(@Payload() data: { teamId: string }) {
    return this.competitionsService.checkTeamExists(data.teamId);
  }
}
