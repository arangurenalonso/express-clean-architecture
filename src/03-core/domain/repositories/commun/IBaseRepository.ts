import { ObjectLiteral } from 'typeorm';

interface IBaseRepository<T extends ObjectLiteral> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export default IBaseRepository;
