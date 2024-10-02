export const QUESTION_STATUS = {
  ACTIVE: 0,
  IN_ACTIVE: 1,
  DELETED: 2,
  PENDING: 3,
} as const;

export type QuestionStatusType =
  (typeof QUESTION_STATUS)[keyof typeof QUESTION_STATUS];
