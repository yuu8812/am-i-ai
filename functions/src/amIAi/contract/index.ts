/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { initContract } from '@ts-rest/core';
import { GAME_CONTRACT } from './rest/game';
import { USER_CONTRACT } from './rest/user';

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
