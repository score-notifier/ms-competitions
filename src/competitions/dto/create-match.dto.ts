import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMatchDto {
  @IsUUID()
  @IsNotEmpty()
  leagueId: string;

  @IsString()
  @IsNotEmpty()
  homeTeam: string;

  @IsString()
  @IsNotEmpty()
  awayTeam: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsDateString()
  UTCDate: string | Date;

  @IsString()
  @IsNotEmpty()
  liveScoreURL: string;

  @IsObject()
  result: {
    awayScore: number;
    homeScore: number;
  };
}
