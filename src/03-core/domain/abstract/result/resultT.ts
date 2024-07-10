import ErrorResult from './error';
import Result from './result';

class ResultT<T> extends Result {
  private readonly _value: T | null;

  constructor(value: T | null, isSuccess: boolean, error: ErrorResult) {
    super(isSuccess, error);
    this._value = value;
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error(
        'InvalidOperation: The value of a failure result cannot be accessed.'
      );
    }
    return this._value!;
  }
}
export default ResultT;
