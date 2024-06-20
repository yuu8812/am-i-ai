declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: 'dev' | 'prod';
        ALLOW_ORIGINS?: string;
      }
    }
  }
}
