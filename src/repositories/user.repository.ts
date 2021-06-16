import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import {User, UserRelations, Wallet} from '../models';
import {WalletRepository} from './wallet.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly wallets: HasManyRepositoryFactory<Wallet, typeof User.prototype.id>;

  constructor(
    @inject('datasources.user') dataSource: UserDataSource,
    @repository.getter('WalletRepository') walletRepositoryGetter: Getter<WalletRepository>
  ) {
    super(User, dataSource);
    this.wallets = this.createHasManyRepositoryFactoryFor('wallets', walletRepositoryGetter);
    this.registerInclusionResolver('wallets', this.wallets.inclusionResolver);
  }

  definePersistedModel(entityClass: typeof User) {
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
