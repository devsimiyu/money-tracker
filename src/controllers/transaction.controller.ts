import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {Transaction} from '../models';
import {TransactionRepository, WalletRepository} from '../repositories';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository : TransactionRepository,
    @repository(WalletRepository)
    public walletRepository : WalletRepository,
  ) {}

  @post('/transactions/{walletId}')
  @response(200, {
    description: 'A new transaction',
    content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
  })
  async create(
    @param.path.number('walletId') walletId: number,
    @requestBody({
      description: 'Save a transaction',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            exclude: ['id', 'createdAt', 'updatedAt', 'walletId'],
          }),
        },
      },
    })
    transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    return this.walletRepository.transactions(walletId).create(transaction);
  }
}
