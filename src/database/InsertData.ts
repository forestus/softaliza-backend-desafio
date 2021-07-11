import { UsersRepository } from '@repositories/UsersRepository'
import { PostsRepository } from '@repositories/PostsRepository'
import { getCustomRepository } from 'typeorm'
import Data from './Data.json'
import slygfy from 'slugify'
// create user
class InsertData {
  // Insere o Usuário no Banco de Dados a partir do arquivo Data.json.
  async insertUser (): Promise<void> {
    const { user } = Data
    const userRepository = getCustomRepository(UsersRepository)
    const userAlreadyExists = await userRepository.findOne({
      username: user.username
    })

    if (userAlreadyExists == null) {
      try {
        const userData = userRepository.create({
          username: user.username,
          password_hash: user.password_hash
        })
        await userRepository.save(userData)
      } catch (error) {
        console.log(error)
      }
      console.log('População de Usuário OK!')
    } else {
      console.log('População de Usuário OK!')
    }
  }

  // Insere Os Posts No Banco de Dados a partir do arquivo Data.json.
  async insertPosts (): Promise<void> {
    const { posts, user } = Data
    const postRepository = getCustomRepository(PostsRepository)
    const userRepository = getCustomRepository(UsersRepository)
    const userAlreadyExists = await userRepository.findOne({
      username: user.username
    })
    await Promise.all(
      posts.map(async (post) => {
        const slug = slygfy(post.title).toLowerCase()
        const postAlreadyExists = await postRepository.findOne({ slug })

        if (postAlreadyExists == null) {
          try {
            const userData = postRepository.create({
              title: post.title,
              slug: slug,
              content: post.content,
              created_by: userAlreadyExists
            })
            await postRepository.save(userData)
          } catch (error) {
            console.log(error)
          }
        }
      })
    )
  }
}
export default new InsertData()
