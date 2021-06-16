import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {User, Wallet} from '../models';
import {UserRepository, WalletRepository} from '../repositories';

export class WalletController {
  constructor(
    @repository(WalletRepository)
    public walletRepository : WalletRepository,
    @repository(UserRepository)
    public userRepository : UserRepository
  ) {}

  @post('/wallets/{userId}')
  @response(200, {
    description: 'A new wallet',
    content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
  })
  async create(
    @param.path.number('userId') userId: typeof User.prototype.id,
    @requestBody({
      description: 'Create a wallet',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {
            exclude: ['id', 'createdAt', 'updatedAt', 'userId'],
          }),
        },
      },
    })
    wallet: Omit<Wallet, 'id'>,
  ): Promise<Wallet> {
    return this.userRepository.wallets(userId).create(wallet);
  }

  @get('/wallets/{id}')
  @response(200, {
    description: 'View wallet balance and transactions',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Wallet, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<Wallet> {
    let wallet = await this.walletRepository.findById(id, {include: ['transactions']});
    wallet.balance = await this.walletRepository.balance(id);
    return wallet;
  }
}
