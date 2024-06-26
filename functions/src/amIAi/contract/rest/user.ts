import { initContract } from '@ts-rest/core';
import { MAX_NAME_STRING } from 'src/amIAi/contract/constants';
import * as z from 'zod';

const c = initContract();

export const USER_CONTRACT = c.router({
  getUser: {
    method: 'GET',
    path: '/user/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      200: c.type<{ id: string; name: string }>(),
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
});
