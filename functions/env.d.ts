declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: Environment['NODE_ENV'];
        a: string;
      }
    }
  }
}
