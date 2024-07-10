import { Repository, DataSource, ObjectLiteral, Entity } from 'typeorm';
import IBaseRepository from '@domain/repositories/commun/IBaseRepository';
import { injectable } from 'inversify';

@injectable()
abstract class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  protected abstract get repository(): Repository<T>;
  // constructor(dataSource: DataSource, entity: new () => T) {
  //   this.repository = dataSource.getRepository(entity);
  // }

  async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async getById(id: string): Promise<T | null> {
    const entity = await this.repository.findOneBy({ id } as any);
    return entity || null;
  }

  async create(entity: T): Promise<T> {
    const newEntity = this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async update(entity: T): Promise<void> {
    await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export default BaseRepository;
