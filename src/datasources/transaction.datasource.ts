import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  name: 'transaction',
  connector: process.env.DATABASE_DIALECT,
  url: process.env.DATABASE_URL
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TransactionDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'transaction';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.transaction', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
