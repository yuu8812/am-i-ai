import * as z from 'zod';

const SHORT_UUID_REGEX = /^[a-zA-Z0-9]{22}$/;

export const SHORT_UUID_SCHEMA = z.string().regex(SHORT_UUID_REGEX, {
  message: 'Invalid short-uuid format',
});
