import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { UserRepository } from 'src/amIAi/repository/user.repository';

@Entity({
  tableName: 'user',
  repository: () => UserRepository,
})
export class User extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ type: 'text' })
  email: string;

  @Property({ type: 'text' })
  name: string;

  [EntityRepositoryType]?: UserRepository;
}
