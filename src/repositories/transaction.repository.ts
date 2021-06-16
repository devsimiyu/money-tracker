import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {TransactionDataSource} from '../datasources';
import {Transaction, TransactionRelations, Wallet} from '../models';
import {WalletRepository} from './wallet.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly wallet: BelongsToAccessor<Wallet, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.transaction') dataSource: TransactionDataSource,
    @repository.getter('WalletRepository') walletRepositoryGetter: Getter<WalletRepository>
  ) {
    super(Transaction, dataSource);
    this.wallet = this.createBelongsToAccessorFor('wallet', walletRepositoryGetter);
    this.registerInclusionResolver('wallet', this.wallet.inclusionResolver);
  }

  definePersistedModel(entityClass: typeof Transaction) {
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
}
