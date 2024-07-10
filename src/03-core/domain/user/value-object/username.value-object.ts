import regularExps from '@domain/helpers/regular-exp';

class Username {
  private readonly _value: string;

  private constructor(value: string) {
    if (!Username.validate(value)) {
      throw new Error('The Username is not a valid Username.');
    }
    this._value = value;
  }

  public static create(value?: string | null): Username | null {
    if (!value) {
      return null;
    }
    return new Username(value);
  }

  private static validate(value: string): boolean {
    return regularExps.username.test(value);
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Username): boolean {
    return this.value === other.value;
  }
}
export default Username;
