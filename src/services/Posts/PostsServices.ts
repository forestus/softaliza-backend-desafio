import { DeleteResult, getCustomRepository, Repository } from 'typeorm'
import { PostsRepository } from '@repositories/PostsRepository'
import { PostEntity } from '@entities/PostEntity'
import { AppError } from '@errors/AppError'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserEntity } from '@entities/UserEntity'
import slygfy from 'slugify'

class PostsService {
  private readonly postsRepository: Repository<PostEntity>
  private readonly usersRepository: Repository<UserEntity>
  // O Constructor salva os repositórios na variável acima para reutilizar em todos os métodos do Serviço.
  constructor () {
    this.postsRepository = getCustomRepository(PostsRepository)
    this.usersRepository = getCustomRepository(UsersRepository)
  }

  async store (title: string, content: string, created_by: string): Promise<PostEntity> {
    // cria o slug baseado no titulo da Postagem.
    const slug = slygfy(title).toLowerCase()
    // Busca no banco a Postagem com slug da mesma.
    const postAlreadyExists = await this.postsRepository.findOne({ slug })
    // Se slug já existe, retorna status e mensagem de erro.
    if (postAlreadyExists != null) {
      throw new AppError('Este Titulo de Postagem Já Existe!', 409)
    }
    // Busca no banco o usuário com id de quem criou a Postagem.
    const userCreated = await this.usersRepository.findOne({ id: created_by })
    // Se Usuário que postou não foi encontrado, retorna status e mensagem de erro.
    if (userCreated == null) {
      throw new AppError('Usuário da Postagem Não encontrado!', 404)
    }
    // Tenta salvar no banco a Postagem, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade da Postagem passando o usuário de criação.
      const postData = this.postsRepository.create({
        title,
        content,
        slug,
        created_by: userCreated
      })
      // Salva a entidade no banco.
      const post = await this.postsRepository.save(postData)
      // Apaga a senha do usuário e depois retorna para o controller.
      delete (post as any).created_by.password_hash
      return post
    } catch (error) {
      throw new AppError(error)
    }
  }

  async findAll (): Promise<PostEntity[]> {
    // Busca no banco todos as Postagens com os usuários que criaram os mesmos.
    const posts = await this.postsRepository.find({
      relations: ['created_by']
    })
    // Se as Postagens não forem encontrados, retorna status e mensagem de erro.
    if (!posts) {
      throw new AppError('Nenhuma Postagem Encontrada!', 404)
    }
    // Remove a senha de cada usuário que fez cada Postagem na Array e logo após retorna para o Controller.
    posts.map((post) => {
      delete (post as any).created_by.password_hash
      return post
    })
    return posts
  }

  async findOne (id: string): Promise<PostEntity> {
    // Busca no banco a Postagem com id da mesma, retorna a Postagem com o usuário que criou a mesma.
    const post = await this.postsRepository.findOne({
      where: { id: id },
      relations: ['created_by']
    })
    // Se a Postagem não existe, retorna status e mensagem de erro.
    if (!post) {
      throw new AppError('Nenhuma Postagem Encontrada!', 404)
    }
    // Remove a senha do usuário que fez a Postagem e logo após retorna para o Controller.
    delete (post as any).created_by.password_hash
    return post
  }

  async findOneBySlug (slug: string): Promise<PostEntity> {
    // Busca no banco a Postagem com slug da mesma, retorna a Postagem com o usuário que criou a mesma.
    const post = await this.postsRepository.findOne({
      where: { slug: slug },
      relations: ['created_by']
    })
    // Se a Postagem não existe, retorna status e mensagem de erro.
    if (!post) {
      throw new AppError('Nenhuma Postagem Encontrada!', 404)
    }
    // Remove a senha do usuário que fez a Postagem e logo após retorna para o Controller.
    delete (post as any).created_by.password_hash
    return post
  }

  async update (id: string, title: string, content: string): Promise<PostEntity> {
    // cria o slug baseado no titulo da Postagem.
    const slug = slygfy(title).toLowerCase()
    // Busca no banco a Postagem com id da mesma, retorna a Postagem com o usuário que criou a mesma.
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['created_by']
    })
    // Se a Postagem não existe, retorna status e mensagem de erro.
    if (post == null) {
      throw new AppError('Nenhuma Postagem Encontrada!', 404)
    }
    // Se os dados a serem persistidos no banco forem os mesmos, retorna status e mensagem de erro.
    if (post.title === title && post.content === content) {
      throw new AppError('Postagem já possui os Dados Informados!', 409)
    }
    // Caso titulo/conteudo/slug sejam passados ele os salva na váriavel, caso não ele persiste o valor antigo.
    typeof title !== 'undefined' &&
      post.title !== title &&
      (post.title = title)
    typeof content !== 'undefined' &&
      post.content !== content &&
      (post.content = content)
    typeof slug !== 'undefined' && post.slug !== slug && (post.slug = slug)
    // Remove a senha do usuário que fez a Postagem
    delete (post as any).created_by.password_hash
    // Tenta salvar no banco a Postagem Atualizada, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade da Postagem passando o usuário de criação.
      const postUpdated = this.postsRepository.create(post)
      // Atualiza a entidade no banco e logo após retorna para o Controller.
      await this.postsRepository.update(id, { ...postUpdated })
      return postUpdated
    } catch (error) {
      throw new AppError(error)
    }
  }

  async destroy (id: string): Promise<DeleteResult> {
    // Busca no banco a Postagem com id da mesma, retorna a mesma com o usuário que a criou.
    const post = await this.postsRepository.findOne({ id })
    // Se a Postagem não existe, retorna status e mensagem de erro.
    if (post == null) {
      throw new AppError('Postagem não Encontrada!', 404)
    }
    // Tenta Excluir no banco a Postagem pelo id passado, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Apaga a entidade pelo ID passado e logo após retorna as linhas afetadas no banco para o Controller.
      const deleted = await this.postsRepository.delete(post.id)
      return deleted
    } catch (error) {
      throw new AppError(error)
    }
  }
}

export { PostsService }
