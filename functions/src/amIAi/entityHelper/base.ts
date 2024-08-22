import { PrimaryKey, Property } from '@mikro-orm/core';
import { generate } from 'short-uuid';

export abstract class BaseEntity {
  @PrimaryKey({ onCreate: () => generate() })
  id: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt: Date;

  @Property({ nullable: true })
  deletedAt: Date;
}
