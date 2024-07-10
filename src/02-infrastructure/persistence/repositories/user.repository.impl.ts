import { inject, injectable, optional } from 'inversify';
import TYPES from '@config/identifiers';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserDomain from '@domain/user/User.domain';
import UserEntity from '@persistence/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import ResultT from '@domain/abstract/result/resultT';
import Result from '@domain/abstract/result/result';

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

  async getUserById(id: string): Promise<ResultT<UserDomain | null>> {
    const userEntity = await this._repository.findOneBy({
      id: id,
    });
    if (!userEntity) {
      return ResultT.Success<null>(null);
    }
    const userDomainResult = this.toDomain(userEntity);
    if (userDomainResult.isFailure) {
      return ResultT.Failure<UserDomain>(userDomainResult.error);
    }
    const user = userDomainResult.value;
    return ResultT.Success<UserDomain>(user);
  }

  protected get repository(): Repository<UserEntity> {
    return this._repository;
  }

  async getUserByUsername(
    username?: string
  ): Promise<ResultT<UserDomain | null>> {
    // const repository = this._datasource.getRepository(UserEntity);
    // const userEntity = await repository.findOneBy({
    //   username: username,
    // });
    if (!username) {
      return ResultT.Success<null>(null);
    }
    const userEntity = await this._repository.findOneBy({
      username: username,
    });
    if (!userEntity) {
      return ResultT.Success<null>(null);
    }
    const userDomainResult = this.toDomain(userEntity);
    if (userDomainResult.isFailure) {
      return ResultT.Failure<UserDomain>(userDomainResult.error);
    }
    const user = userDomainResult.value;
    return ResultT.Success<UserDomain>(user);
  }
  async getUserByEmail(email?: string): Promise<ResultT<UserDomain | null>> {
    if (!email) {
      return ResultT.Success<null>(null);
    }
    const userEntity = await this._repository.findOneBy({
      email: email,
    });

    if (!userEntity) {
      return ResultT.Success<null>(null);
    }
    const userDomainResult = this.toDomain(userEntity);
    if (userDomainResult.isFailure) {
      return ResultT.Failure<UserDomain>(userDomainResult.error);
    }
    const user = userDomainResult.value;
    return ResultT.Success<UserDomain>(user);
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

  private toDomain(userEntity: UserEntity): ResultT<UserDomain> {
    const userDomainResult = UserDomain.create({
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      passwordHash: userEntity.passwordHash,
    });
    if (userDomainResult.isFailure) {
      return ResultT.Failure<UserDomain>(userDomainResult.error);
    }
    return ResultT.Success<UserDomain>(userDomainResult.value);
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
