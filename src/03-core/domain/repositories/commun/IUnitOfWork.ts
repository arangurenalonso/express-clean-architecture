import { EntityManager } from 'typeorm';
import IUserRepository from '../IUser.repository';
import BaseDomain from '@domain/abstract/base.domain';

interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  get entityManager(): EntityManager | null;
  get userRepository(): IUserRepository;
  collectDomainEvents(domains: BaseDomain<any>[]): void;
}

export default IUnitOfWork;
