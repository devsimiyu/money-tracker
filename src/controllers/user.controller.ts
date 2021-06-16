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
import {User} from '../models';
import {UserRepository, WalletRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(WalletRepository)
    public walletRepository : WalletRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'New user account',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User)
      }
    }
  })
  async create(
    @requestBody({
      description: 'User sign up',
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['id', 'createdAt', 'updatedAt']
          })
        }
      }
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User profile',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<User> {
    let user = await this.userRepository.findById(id, {include: [{relation: 'wallets'}]});
    user.wallets = user.wallets || [];
    for (let i = 0; i < user.wallets.length; i++) {
      const wallet = user.wallets[i];
      wallet.balance = await this.walletRepository.balance(wallet.getId());
      user.balance = (user.balance || 0) + wallet.balance;
      user.wallets[i] = wallet;
    }
    return user;
  }
}
