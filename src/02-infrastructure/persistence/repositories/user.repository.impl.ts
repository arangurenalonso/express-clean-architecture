import { inject, injectable, optional } from 'inversify';
import TYPES from '@config/identifiers';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserDomain from '@domain/user/User.domain';
import UserEntity from '@persistence/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import BaseRepository from './commun/BaseRepository';

@injectable()
class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  private _repository: Repository<UserEntity>;

  constructor(
    @inject(TYPES.DataSource)
    private readonly _dataSourceOrEntityManager: DataSource | EntityManager
  ) {
    super();
    if (this._dataSourceOrEntityManager instanceof DataSource) {
      // console.log('instance of DataSource');
      this._repository =
        this._dataSourceOrEntityManager.getRepository(UserEntity);
    } else if (this._dataSourceOrEntityManager instanceof EntityManager) {
      // console.log('instance of EntityManager');
      this._repository =
        this._dataSourceOrEntityManager.getRepository(UserEntity);
    } else {
      throw new Error('Invalid constructor argument');
    }
  }

  async getUserById(id: string): Promise<UserDomain | null> {
    const userEntity = await this._repository.findOneBy({
      id: id,
    });
    const userDomain = userEntity ? this.toDomain(userEntity) : null;
    return userDomain;
  }

  protected get repository(): Repository<UserEntity> {
    return this._repository;
  }

  async getUserByUsername(username?: string): Promise<UserDomain | null> {
    // const repository = this._datasource.getRepository(UserEntity);
    // const userEntity = await repository.findOneBy({
    //   username: username,
    // });
    if (!username) {
      return null;
    }
    const userEntity = await this._repository.findOneBy({
      username: username,
    });
    const userDomain = userEntity ? this.toDomain(userEntity) : null;
    return userDomain;
  }
  async getUserByEmail(email?: string): Promise<UserDomain | null> {
    if (!email) {
      return null;
    }
    const userEntity = await this._repository.findOneBy({
      email: email,
    });

    const userDomain = userEntity ? this.toDomain(userEntity) : null;
    return userDomain;
  }
  async registerUser(user: UserDomain): Promise<void> {
    const userEntity = this.toEntity(user);
    await this.create(userEntity);
  }
  async validateEmail(userId: string): Promise<void> {
    const userEntity = await this._repository.findOneBy({
      id: userId,
    });
    if (!userEntity) {
      throw new Error('User not found');
    }
    userEntity.emailValidated = true;
    await this.update(userEntity);
  }

  private toDomain(userEntity: UserEntity): UserDomain {
    return UserDomain.create({
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      passwordHash: userEntity.passwordHash,
    });
  }
  private toEntity(userDomain: UserDomain): UserEntity {
    const userEntity = new UserEntity();
    if (userDomain.properties.id) {
      userEntity.id = userDomain.properties.id;
    }
    userEntity.username = userDomain.properties.username;
    userEntity.email = userDomain.properties.email;
    userEntity.passwordHash = userDomain.properties.passwordHash;
    return userEntity;
  }
}
export default UserRepository;
