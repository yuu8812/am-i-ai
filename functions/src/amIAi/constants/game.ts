export const GAME_MODE = {
  DETECT_HUMAN: 0,
  DETECT_AI: 1,
} as const;

export type GameModeType = (typeof GAME_MODE)[keyof typeof GAME_MODE];

export const VOTE_TYPE = {
  IS_HUMAN: 0,
  IS_AI: 1,
} as const;

export type VoteType = (typeof VOTE_TYPE)[keyof typeof VOTE_TYPE];

export const IS_VOTED = {
  NOT_VOTED: 0,
  VOTED: 1,
} as const;

export type IsVotedType = (typeof IS_VOTED)[keyof typeof IS_VOTED];

export const WHICH_USER = {
  HUMAN: 0,
  AI: 1,
} as const;

export type WhichUserType = (typeof WHICH_USER)[keyof typeof WHICH_USER];

export const LANGUAGE = {
  JP: 0,
  EN: 1,
} as const;

export type LanguageType = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export const GAME_RATE_TYPE = {
  HUMAN_DETECTION: 0,
  HUMAN_NESS: 1,
} as const;

export type GameRateType = (typeof GAME_RATE_TYPE)[keyof typeof GAME_RATE_TYPE];
