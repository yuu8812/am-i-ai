/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { NestRequestShapes, NestResponseShapes } from '@ts-rest/nest';
import CONTRACT from '../contract';

export type GameContractRequestShapes = NestRequestShapes<
  typeof CONTRACT.GAMES
>;

export type GameContractResponseShapes = NestResponseShapes<
  typeof CONTRACT.GAMES
>;

export type UserContractRequestShapes = NestRequestShapes<
  typeof CONTRACT.USERS
>;

export type UserContractResponseShapes = NestResponseShapes<
  typeof CONTRACT.USERS
>;
