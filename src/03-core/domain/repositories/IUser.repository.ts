import ResultT from '@domain/abstract/result/resultT';
import UserDomain from '@domain/user/User.domain';
interface IUserRepository {
  getUserByUsername(username?: string): Promise<ResultT<UserDomain | null>>;
  getUserByEmail(email?: string): Promise<ResultT<UserDomain | null>>;
  getUserById(id: string): Promise<ResultT<UserDomain | null>>;
  validateEmail(userId: string): Promise<void>;
  registerUser(user: UserDomain): Promise<void>;
}
export default IUserRepository;
