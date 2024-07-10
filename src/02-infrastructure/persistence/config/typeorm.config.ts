import { DataSource } from 'typeorm';
import TYPES from '@config/identifiers';
import { inject, injectable } from 'inversify';
import EnvironmentConfig from '@config/enviromentConfig';

@injectable()
class TypeORMInitializer {
  private _appDataSource?: DataSource;

  constructor(
    @inject(TYPES.EnvironmentConfig)
    private readonly _environmentConfig: EnvironmentConfig
  ) {}

  initialize(): Promise<any> {
    const appDataSource = new DataSource({
      type: 'postgres',
      host: this._environmentConfig.dbHost,
      port: this._environmentConfig.dbPort,
      username: this._environmentConfig.dbUserName,
      password: this._environmentConfig.dbPassword,
      database: this._environmentConfig.dbName,
      synchronize: this._environmentConfig.dbSincronize,
      logging: this._environmentConfig.dbLogging,
      entities: this._environmentConfig.dbEntities,
      migrationsTableName: 'migration_table',
      migrations: ['src/infrastructure/persistence/migration/**/*.ts'],
    });
    this._appDataSource = appDataSource;
    return this._appDataSource
      .initialize()
      .then(() => {
        console.log('Database initialized');
      })
      .catch((error) => {
        console.error('Database Error: ', error);
      });
  }
  close(): void {
    this._appDataSource?.destroy();
  }
  get dataSource(): DataSource {
    if (!this._appDataSource) {
      throw new Error('Database not initialized');
    }
    return this._appDataSource;
  }
}
export default TypeORMInitializer;
