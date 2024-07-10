class PasswordHash {
  private readonly _value: string;

  private constructor(value: string) {
    if (!value || value.length === 0) {
      throw new Error('Password hash cannot be empty.');
    }
    this._value = value;
  }

  public static create(value: string): PasswordHash {
    return new PasswordHash(value);
  }

  get value(): string {
    return this._value;
  }

  public equals(other: PasswordHash): boolean {
    return this.value === other.value;
  }
}
export default PasswordHash;
