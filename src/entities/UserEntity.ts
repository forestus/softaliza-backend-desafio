import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import bcrypt from 'bcryptjs'
import { PostEntity } from './PostEntity'

@Entity('users')
class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string

  @Column({ unique: true })
  username: string

  @Column()
  password_hash: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => PostEntity, (postentity) => postentity.created_by)
  posts: PostEntity[]

  @UpdateDateColumn()
  updated_at: Date

  @BeforeInsert()
  hashPassword (): void {
    this.password_hash = bcrypt.hashSync(this.password_hash, 10)
  }

  @BeforeUpdate()
  hashPasswordUpdate (): void {
    this.password_hash = bcrypt.hashSync(this.password_hash, 10)
  }
}
export { UserEntity }
