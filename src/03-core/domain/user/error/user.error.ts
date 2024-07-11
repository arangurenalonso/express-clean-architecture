import ErrorResult from '@domain/abstract/result/error';

class UserErrors {
  static readonly USER_UNERNAME_EMAIL_REQUIRED: ErrorResult = new ErrorResult(
    'User.Create',
    'Username and Email are required',
    400
  );
  static readonly USER_NOT_FOUND: ErrorResult = new ErrorResult(
    'User.Get',
    'User does not Found',
    404
  );
  static readonly USER_ALREADY_EXISTS = (
    type: 'username' | 'email',
    value: string
  ): ErrorResult => {
    return new ErrorResult(
      'User.Exist',
      `User with ${
        type.charAt(0).toUpperCase() + type.slice(1)
      } '${value}' already exists`,
      400
    );
  };
  static readonly USER_INVALID_EMAIL = (email?: string): ErrorResult => {
    const emailMessage = email ? ` "${email}"` : '';
    return new ErrorResult(
      'Usuario.Exist',
      `User Email${emailMessage} is not a valid email`,
      400
    );
  };
  static readonly USER_INVALID_USERNAME = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'Usuario.Username',
      `User Username is not valid: ${reasonsMessage}`,
      400
    );
  };
  static readonly USER_INVALID_PASSWORD = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'Usuario.Password',
      `User Password is not valid: ${reasonsMessage}`,
      400
    );
  };

  static readonly USER_INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'Usuario.Exist',
      `User ID${idMessage} is not a valid ID`,
      400
    );
  };
}

export default UserErrors;
