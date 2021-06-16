import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Wallet} from './wallet.model';

enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

@model({
  settings: {
    postgresql: {
      table: 'transactions'
    }
  }
})
export class Transaction extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(TransactionType)
    }
  })
  type: TransactionType;

  @belongsTo(() => Wallet, {name: 'wallet'})
  walletId: number;

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


  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
