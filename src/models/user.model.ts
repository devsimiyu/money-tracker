import {Entity, hasMany, model, property} from '@loopback/repository';
import {Wallet} from './wallet.model';

@model({
  settings: {
    postgresql: {
      table: 'users'
    }
  }
})
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @hasMany(() => Wallet, {keyTo: 'userId'})
  wallets?: Wallet[];

  @property({
    type: 'date',
    defaultFn: 'now',
    name: 'created_at'
  })
  createdAt?: string;

  @property({
    type: 'date',
    name: 'updated_at'
  })
  updatedAt?: string;

  balance?: number;


  constructor(data?: Partial<User>) {
    super(data);
  }

  toJSON(): Object {
    return this;
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
