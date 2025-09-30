import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAccountDto {
  @IsString({ message: 'Le compound_id est requis' })
  compoundId: string;

  @IsString({ message: 'Le type de provider est requis' })
  providerType: string;

  @IsString({ message: 'L\'ID du provider est requis' })
  providerId: string;

  @IsString({ message: 'L\'ID du compte provider est requis' })
  providerAccountId: string;

  @IsOptional()
  @IsString({ message: 'Le refresh token doit être une chaîne de caractères' })
  refreshToken?: string;

  @IsOptional()
  @IsString({ message: 'L\'access token doit être une chaîne de caractères' })
  accessToken?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La date d\'expiration doit être au format ISO' })
  accessTokenExpires?: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString({ message: 'Le compound_id doit être une chaîne de caractères' })
  compoundId?: string;

  @IsOptional()
  @IsString({ message: 'Le type de provider doit être une chaîne de caractères' })
  providerType?: string;

  @IsOptional()
  @IsString({ message: 'L\'ID du provider doit être une chaîne de caractères' })
  providerId?: string;

  @IsOptional()
  @IsString({ message: 'L\'ID du compte provider doit être une chaîne de caractères' })
  providerAccountId?: string;

  @IsOptional()
  @IsString({ message: 'Le refresh token doit être une chaîne de caractères' })
  refreshToken?: string;

  @IsOptional()
  @IsString({ message: 'L\'access token doit être une chaîne de caractères' })
  accessToken?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La date d\'expiration doit être au format ISO' })
  accessTokenExpires?: string;
}
