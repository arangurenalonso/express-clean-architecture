import regularExps from '@domain/helpers/regular-exp';

class Email {
  private readonly _value: string;

  private constructor(value: string) {
    if (!Email.validate(value)) {
      throw new Error('The Username is not a valid email.');
    }
    this._value = value;
  }

  public static create(value?: string | null): Email | null {
    if (!value) {
      return null;
    }
    return new Email(value);
  }
  private static validate(value: string): boolean {
    return regularExps.email.test(value);
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
export default Email;
