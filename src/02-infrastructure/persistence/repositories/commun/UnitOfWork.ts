import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { injectable, inject } from 'inversify';
import IUnitOfWork from '@domain/repositories/commun/IUnitOfWork';
import TYPES from '@config/identifiers';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserRepository from '../user.repository.impl';
import IDomainEvent from '@domain/abstract/IDomainEvent';
import { Mediator } from 'mediatr-ts';
import BaseDomain from '@domain/abstract/base.domain';
import OutboxMessageEntity from '@persistence/entities/OutboxMessage.entity';

@injectable()
class UnitOfWork implements IUnitOfWork {
  private _queryRunner: QueryRunner | null = null;
  private _entityManager: EntityManager | null = null;
  private _userRepository: IUserRepository | null = null;
  private _domainEvents: IDomainEvent[] = [];

  constructor(
    @inject(TYPES.DataSource) private readonly _dataSource: DataSource,
    @inject(TYPES.Mediator) private readonly _mediator: Mediator
  ) {}

  get userRepository(): IUserRepository {
    if (!this._entityManager) {
      throw new Error('Transaction has not been started');
    }
    return (this._userRepository ||= new UserRepository(this._entityManager));
  }

  async startTransaction(): Promise<void> {
    this._queryRunner = this._dataSource.createQueryRunner();
    await this._queryRunner.startTransaction();
    this._entityManager = this._queryRunner.manager;
  }

  async commit(): Promise<void> {
    if (!this._queryRunner) {
      throw new Error('Transaction has not been started');
    }
    await this._queryRunner.commitTransaction();
    await this.addDomainEventsAsOutboxMessages();
    // await this.dispatchDomainEvents();
    await this.dispose();
  }

  async rollback(): Promise<void> {
    if (!this._queryRunner) {
      throw new Error('Transaction has not been started');
    }
    await this._queryRunner.rollbackTransaction();
    await this.dispose();
  }

  private async dispose(): Promise<void> {
    if (this._queryRunner) {
      await this._queryRunner.release();
    }
    this._entityManager = null;
    this._queryRunner = null;
  }

  get entityManager(): EntityManager | null {
    return this._entityManager;
  }

  collectDomainEvents(domains: BaseDomain<any>[]): void {
    domains.forEach((domain) => {
      this._domainEvents.push(...domain.getAndClearDomainEvents());
    });
  }
  private async addDomainEventsAsOutboxMessages(): Promise<void> {
    const outboxRepository =
      this._dataSource.getRepository(OutboxMessageEntity);
    const outboxMessages = this._domainEvents.map((event) => {
      const outboxMessage = new OutboxMessageEntity();
      outboxMessage.type = event.constructor.name;
      outboxMessage.content = JSON.stringify(event);
      return outboxMessage;
    });

    await outboxRepository.save(outboxMessages);
    this._domainEvents = [];
  }
  // private async dispatchDomainEvents(): Promise<void> {
  //   for (const event of this._domainEvents) {
  //     await this._mediator.publish(event);
  //   }
  //   this._domainEvents = [];
  // }
}

export default UnitOfWork;
