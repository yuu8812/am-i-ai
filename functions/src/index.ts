import * as functions from 'firebase-functions';

const REGION = 'asia-northeast1';
const MIN_INSTANCE = 0;
const MAX_INSTANCE = 4;

const amIAi = () => {
  switch (process.env.NODE_ENV) {
    case 'NEST_SELF_HOSTED':
      return (async () => {
        const { bootStrap } = await import('./amIAi/index');
        await bootStrap();
      })();

    case 'FIREBASE_FUNCTIONS':
      return functions
        .region(REGION)
        .runWith({
          maxInstances: MAX_INSTANCE,
          minInstances: MIN_INSTANCE,
        })
        .https.onRequest(async (...args) => {
          const { server, ready } = await import('./amIAi/index');
          await ready();
          server(...args);
        });

    default:
      throw new Error('Invalid NODE_ENV');
  }
};
const am_i_ai = amIAi();

export { am_i_ai };
