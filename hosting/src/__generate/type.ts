import { NestRequestShapes, NestResponseShapes } from '@ts-rest/nest';
import CONTRACT from 'src/amIAi/contract';

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
