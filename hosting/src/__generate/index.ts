import { initContract } from '@ts-rest/core';
import { GAME_CONTRACT } from 'src/amIAi/contract/rest/game';
import { USER_CONTRACT } from 'src/amIAi/contract/rest/user';

const c = initContract();

const CONTRACT = c.router(
  {
    GAMES: GAME_CONTRACT,
    USERS: USER_CONTRACT,
  },
  {
    baseHeaders: c.type<{
      'x-user-id': string;
    }>(),
  },
);

export default CONTRACT;
