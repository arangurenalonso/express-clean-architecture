import { Entity, Column } from 'typeorm';
import BaseEntity from './abstrations/base.entity';

@Entity('users')
class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  username?: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email?: string | null;
  @Column({ type: 'varchar', length: 100, nullable: false })
  passwordHash!: string;

  @Column({ type: 'boolean', default: false })
  emailValidated: boolean = false;
}
export default UserEntity;
