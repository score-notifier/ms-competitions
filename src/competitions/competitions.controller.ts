import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompetitionsService } from './competitions.service';
import { CreateTeamDto, CreateLeagueDto, CreateMatchDto } from './dto';

@Controller()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @MessagePattern('competitions.teams.create')
  async createTeams(@Payload() createTeamDtoList: CreateTeamDto[]) {
    return this.competitionsService.createTeams(createTeamDtoList);
  }

  @MessagePattern('competitions.leagues.create')
  async createLeagues(@Payload() createLeagueDtoList: CreateLeagueDto[]) {
    return this.competitionsService.createLeagues(createLeagueDtoList);
  }

  @MessagePattern('competitions.matches.create')
  async createMatches(@Payload() createMatchDtoList: CreateMatchDto[]) {
    return this.competitionsService.createMatches(createMatchDtoList);
  }

  @MessagePattern('competitions.get.leagues')
  async getLeagues() {
    return this.competitionsService.getLeagues();
  }

  @MessagePattern('competitions.leagues')
  async getTeams(@Payload('leagueId', ParseUUIDPipe) leagueId: string) {
    return this.competitionsService.getTeams(leagueId);
  }

  @MessagePattern('competitions.leagues.matches')
  async getMatches(
    @Payload('leagueId', ParseUUIDPipe) leagueId: string,
    @Payload('teamId', ParseUUIDPipe) teamId: string,
  ) {
    return this.competitionsService.getMatches(leagueId, teamId);
  }

  @MessagePattern('competitions.leagues.upcoming.matches')
  async getUpcomingMatches(
    @Payload('leagueId', ParseUUIDPipe) leagueId: string,
    @Payload('teamId', ParseUUIDPipe) teamId: string,
  ) {
    return this.competitionsService.getUpcomingMatches(leagueId, teamId);
  }

  @MessagePattern('competitions.league.exists')
  async checkLeagueExists(@Payload() data: { leagueId: string }) {
    return this.competitionsService.checkLeagueExists(data.leagueId);
  }

  @MessagePattern('competitions.team.exists')
  async checkTeamExists(@Payload() data: { teamId: string }) {
    return this.competitionsService.checkTeamExists(data.teamId);
  }

  @MessagePattern('competitions.team')
  async getTeamByName(@Payload('teamName') teamName: string) {
    return this.competitionsService.getTeamByName(teamName);
  }

  @MessagePattern('competitions.league.url')
  async getLeagueByScoreLiveURL(@Payload('scoreLiveURL') scoreLiveURL: string) {
    return this.competitionsService.getLeagueByScoreLiveURL(scoreLiveURL);
  }

  @MessagePattern('competitions.team.url')
  async getTeamByScoreLiveURL(@Payload('scoreLiveURL') scoreLiveURL: string) {
    return this.competitionsService.getTeamByScoreLiveURL(scoreLiveURL);
  }

  @MessagePattern('competitions.league.id')
  async getLeagueById(@Payload('leagueId', ParseUUIDPipe) leagueId: string) {
    return this.competitionsService.getLeagueById(leagueId);
  }

  @MessagePattern('competitions.team.id')
  async getTeamById(@Payload('teamId', ParseUUIDPipe) teamId: string) {
    return this.competitionsService.getTeamById(teamId);
  }
}
