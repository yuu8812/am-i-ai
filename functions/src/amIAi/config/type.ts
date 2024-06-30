export type Environment = {
  ENV: string;
  NODE_ENV: 'NEST_SELF_HOSTED' | 'FIREBASE_FUNCTIONS';
  ALLOW_ORIGINS: string;
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  GOOGLE_CLIENT_ID: string;
};
