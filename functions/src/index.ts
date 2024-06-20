import * as functions from 'firebase-functions';

const REGION = 'asia-northeast1';
const MIN_INSTANCE = 0;
const MAX_INSTANCE = 4;

export const amIAi = functions
  .region(REGION)
  .runWith({
    maxInstances: MAX_INSTANCE,
    minInstances: MIN_INSTANCE,
  })
  .https.onRequest(async (...args) => {
    const { server, ready } = await import('./amIAi/index');
    await ready;
    server(...args);
  });
