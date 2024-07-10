import ResultT from './resultT';
import ErrorResult from './error';

class Result {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;

  public readonly error: ErrorResult;

  constructor(isSuccess: boolean, error: ErrorResult) {
    if (isSuccess && !error.equals(ErrorResult.None)) {
      throw new Error('InvalidOperation');
    }
    if (!isSuccess && error.equals(ErrorResult.None)) {
      throw new Error('InvalidOperation');
    }
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
  }

  public static Success(): Result;
  public static Success<T>(value: T): ResultT<T>;

  public static Success<T>(value?: T): Result | ResultT<T> {
    if (value === undefined) {
      return new Result(true, ErrorResult.None);
    }
    return new ResultT<T>(value, true, ErrorResult.None);
  }
  public static Failure(error: ErrorResult): Result;
  public static Failure<T>(error: ErrorResult): ResultT<T>;

  public static Failure<T>(error: ErrorResult): Result | ResultT<T> {
    return new ResultT<T>(null, false, error);
  }

  public static Create<T>(value: T | null): Result | ResultT<T> {
    return value !== null
      ? ResultT.Success(value)
      : ResultT.Failure(ErrorResult.NullValue);
  }
}
export default Result;
