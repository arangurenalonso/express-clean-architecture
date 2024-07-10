import ErrorResult from '@domain/abstract/result/error';

class UserApplicationErrors {
  static readonly USER_CREATE_ERROR = (error: string): ErrorResult => {
    return new ErrorResult(
      'User.Create',
      `Error while User create ${error}`,
      500
    );
  };
}

export default UserApplicationErrors;
