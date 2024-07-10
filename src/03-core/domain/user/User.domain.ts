import Email from './value-object/email.value-object';
import PasswordHash from './value-object/passwordhast.value-object';
import UserId from './value-object/user-id.value-object';
import TodoId from './value-object/user-id.value-object';
import BaseDomain from '@domain/abstract/base.domain';
import Username from './value-object/username.value-object';
import UserCreatedDomainEvent from './events/user-created.domain-event';

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

  public static create(properties: UserDomainProperties): UserDomain {
    const id = UserId.create(properties.id);
    const email = Email.create(properties.email);
    const passwordHash = PasswordHash.create(properties.passwordHash);
    const username = Username.create(properties.username);
    const user = new UserDomain({ id, email, passwordHash, username });
    if (!properties.id) {
      user.raiseDomainEvent(new UserCreatedDomainEvent(user._id.value));
    }

    return user;
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
