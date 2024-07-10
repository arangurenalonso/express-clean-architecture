import Email from './value-object/email.value-object';
import PasswordHash from './value-object/passwordhast.value-object';
import UserId from './value-object/user-id.value-object';
import TodoId from './value-object/user-id.value-object';
import BaseDomain from '@domain/abstract/base.domain';
import Username from './value-object/username.value-object';
import UserCreatedDomainEvent from './events/user-created.domain-event';
import ResultT from '@domain/abstract/result/resultT';

interface UserDomainProperties {
  id?: string;
  username?: string | null;
  email?: string | null;
  passwordHash: string;
}

type UserDomainConstructor = {
  id: TodoId;
  username?: Username | null;
  email?: Email | null;
  passwordHash: PasswordHash;
};

class UserDomain extends BaseDomain<TodoId> {
  private _passwordHash: PasswordHash;
  private _username?: Username | null;
  private _email?: Email | null;

  private constructor(properties: UserDomainConstructor) {
    super(properties.id);
    this._email = properties.email;
    this._passwordHash = properties.passwordHash;
    this._username = properties.username;
  }

  public static create(properties: UserDomainProperties): ResultT<UserDomain> {
    const resultId = UserId.create(properties.id);
    if (resultId.isFailure) {
      return ResultT.Failure<UserDomain>(resultId.error);
    }
    const resultEmail = Email.create(properties.email);
    if (resultEmail.isFailure) {
      return ResultT.Failure<UserDomain>(resultEmail.error);
    }
    const resultPasswordHash = PasswordHash.create(properties.passwordHash);
    if (resultPasswordHash.isFailure) {
      return ResultT.Failure<UserDomain>(resultPasswordHash.error);
    }
    const resultUsername = Username.create(properties.username);

    const passwordHash = resultPasswordHash.value;
    const id = resultId.value;
    const email = resultEmail.value;
    const username = resultUsername.value;

    const user = new UserDomain({ id, email, passwordHash, username });
    if (!properties.id) {
      user.raiseDomainEvent(new UserCreatedDomainEvent(user._id.value));
    }

    return ResultT.Success<UserDomain>(user);
  }

  get properties(): UserDomainProperties {
    return {
      id: this._id.value,
      username: this._username?.value,
      email: this._email?.value,
      passwordHash: this._passwordHash.value,
    };
  }
}

export default UserDomain;
