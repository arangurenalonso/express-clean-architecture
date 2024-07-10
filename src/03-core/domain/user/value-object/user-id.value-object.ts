import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this.validate(value);
  }

  public static create(value?: string): UserId {
    if (!value) {
      value = uuidv4();
    }
    return new UserId(value);
  }

  private validate(value: string) {
    if (!value) {
      throw new Error('Todo ID cannot be empty.');
    }
    if (!uuidValidate(value)) {
      throw new Error('Todo ID is not a valid UUID');
    }
  }

  get value(): string {
    return this._value;
  }

  public equals(other: UserId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default UserId;
