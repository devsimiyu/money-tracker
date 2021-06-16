import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Transaction} from './transaction.model';
import {User} from './user.model';

@model({
  settings: {
    postgresql: {
      table: 'wallets'
    }
  }
})
export class Wallet extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @belongsTo(() => User, {name: 'user'}, {type: 'number'})
  userId: User;

  @property({
    type: 'string',
    required: true
  })
  name: string;

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

  @hasMany(() => Transaction, {keyTo: 'walletId'})
  transactions?: Transaction[];

  balance?: number;

  constructor(data?: Partial<Wallet>) {
    super(data);
  }

  toJSON(): Object {
    return this;
  }
}

export interface WalletRelations {
  // describe navigational properties here
}

export type WalletWithRelations = Wallet & WalletRelations;
