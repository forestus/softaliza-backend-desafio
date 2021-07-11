import { UserEntity } from '@entities/UserEntity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(UserEntity)
class UsersRepository extends Repository<UserEntity> {}
export { UsersRepository }
