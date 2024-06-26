declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends Environment {
        TZ: string | symbol | number;
      }
    }
  }
}
