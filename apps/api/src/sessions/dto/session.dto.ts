import { IsString, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsDateString({}, { message: 'La date d\'expiration doit être au format ISO' })
  expires: string;

  @IsString({ message: 'Le token de session est requis' })
  sessionToken: string;

  @IsString({ message: 'Le token d\'accès est requis' })
  accessToken: string;
}

export class UpdateSessionDto {
  @IsDateString({}, { message: 'La date d\'expiration doit être au format ISO' })
  expires: string;

  @IsString({ message: 'Le token de session doit être une chaîne de caractères' })
  sessionToken: string;

  @IsString({ message: 'Le token d\'accès doit être une chaîne de caractères' })
  accessToken: string;
}
