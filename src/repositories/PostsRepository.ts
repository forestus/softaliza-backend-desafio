import { PostEntity } from '@entities/PostEntity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(PostEntity)
class PostsRepository extends Repository<PostEntity> {}
export { PostsRepository }
