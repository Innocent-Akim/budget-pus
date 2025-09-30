export interface Account {
  compoundId: string;
  providerType: string;
  providerId: string;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: string;
}

