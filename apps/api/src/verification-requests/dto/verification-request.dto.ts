import { IsString, IsDateString } from 'class-validator';

export class CreateVerificationRequestDto {
  @IsString({ message: 'L\'identifiant est requis' })
  identifier: string;

  @IsString({ message: 'Le token est requis' })
  token: string;

  @IsDateString({}, { message: 'La date d\'expiration doit être au format ISO' })
  expires: string;
}
