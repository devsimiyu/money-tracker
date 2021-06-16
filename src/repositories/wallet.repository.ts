import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {WalletDataSource} from '../datasources';
import {Transaction, User, Wallet, WalletRelations} from '../models';
import {TransactionRepository} from './transaction.repository';
import {UserRepository} from './user.repository';

export class WalletRepository extends DefaultCrudRepository<
  Wallet,
  typeof Wallet.prototype.id,
  WalletRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Wallet.prototype.id>;

  public readonly transactions: HasManyRepositoryFactory<Transaction, typeof Wallet.prototype.id>;

  constructor(
    @inject('datasources.wallet') dataSource: WalletDataSource,
    @repository.getter('UserRepository') userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('TransactionRepository') transactionRepositoryGetter: Getter<TransactionRepository>
  ) {
    super(Wallet, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.transactions = this.createHasManyRepositoryFactoryFor('transactions', transactionRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
  }

  definePersistedModel(entityClass: typeof Wallet) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', function setTimestamps(ctx, next) {
      const now = new Date();
      if (ctx.instance) {
        if (!ctx.isNewInstance)
          ctx.instance.updatedAt = now;
      }
      else {
        ctx.data.updatedAt = now;
      }
      next();
    });
    return modelClass;
  }

  async balance(walletId: number): Promise<number> {
    const income = await this.execute("select sum(amount) as total from transactions where type = 'income' and walletId = ?", [walletId]);
    const expense = await this.execute("select sum(amount) as total from transactions where type = 'expense' and walletId = ?", [walletId]);
    return income[0].total - expense[0].total;
  }
}
