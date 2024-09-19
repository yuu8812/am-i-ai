/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { MAX_NAME_STRING } from './constants';
import { initContract } from '@ts-rest/core';
import * as z from 'zod';

const c = initContract();

export const USER_CONTRACT = c.router({
  getUser: {
    method: 'GET',
    path: '/user',
    responses: {
      200: c.type<{
        id: string;
        name: string;
        iconUrl: string;
        rates: {
          humanDetection: {
            rate: number;
            createdAt: Date;
          }[];
          humanDetectionRank: number;
          aiNess: {
            rate: number;
            createdAt: Date;
          }[];
          aiNessRank: number;
        };
      }>(),
    },
  },

  createUser: {
    method: 'POST',
    path: '/user',
    responses: {
      201: c.type<{ id: string }>(),
    },
    body: z.object({
      name: MAX_NAME_STRING,
    }),
  },

  editUser: {
    method: 'PUT',
    path: '/user/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      200: c.type<{ id: string }>(),
    },
    body: z.object({
      name: MAX_NAME_STRING,
    }),
  },

  onlineCheck: {
    method: 'GET',
    path: '/user/onlineCheck',
    responses: {
      201: z.object({
        onlineUsersCount: z.number(),
        waitingUsersCount: z.number(),
        activeGameCount: z.number(),
      }),
    },
  },
});
