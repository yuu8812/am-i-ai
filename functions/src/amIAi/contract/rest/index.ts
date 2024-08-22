/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { initContract } from '@ts-rest/core';
import { GAME_CONTRACT } from './game';
import { USER_CONTRACT } from './user';

const c = initContract();

const CONTRACT = c.router(
  {
    GAMES: GAME_CONTRACT,
    USERS: USER_CONTRACT,
  },
  {
    baseHeaders: c.type<{
      'x-user-id'?: string;
      'x-language'?: string;
    }>(),
  },
);

export default CONTRACT;
