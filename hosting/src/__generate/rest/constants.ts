/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { z } from 'zod';

export const MAX_NAME_STRING = z.string().min(1).max(30);
export const MAX_ANSWER_STRING = z.string().min(1).max(100);
