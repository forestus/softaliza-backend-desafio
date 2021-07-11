import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserEntity } from './UserEntity'

@Entity('posts')
class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string

  @Column()
  title: string

  @Column()
  content: string

  @Column({ unique: true })
  slug: string

  @ManyToOne(() => UserEntity, (userentity) => userentity.posts, {
    onDelete: 'CASCADE'
  })
  created_by: UserEntity

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
export { PostEntity }
