import UserDomain from '@domain/user/User.domain';
interface IUserRepository {
  getUserByUsername(username?: string): Promise<UserDomain | null>;
  getUserByEmail(email?: string): Promise<UserDomain | null>;
  getUserById(id: string): Promise<UserDomain | null>;
  validateEmail(userId: string): Promise<void>;
  registerUser(user: UserDomain): Promise<void>;
}
export default IUserRepository;
