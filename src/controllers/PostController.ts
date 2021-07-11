import { Request, Response } from 'express'
import { AppError } from '@errors/AppError'
import { PostsService } from '@services/Posts/PostsServices'

class PostController {
  // Cria uma nova Postagem recebendo os dados pelo corpo da requisição, retorna os dados da Postagem criada e seu relacionamento com status correspondente.
  async store (request: Request, response: Response): Promise<Response> {
    const { title, content, created_by } = request.body
    const postsService = new PostsService()

    try {
      const post = await postsService.store(title, content, created_by)
      return response.status(201).json({
        ...post
      })
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca todos as Postagens armazenados no Banco, retorna os dados dos posts criados e seus relacionamentos em uma Array com status correspondente.
  async findAll (request: Request, response: Response): Promise<Response> {
    const postsService = new PostsService()
    try {
      const posts = await postsService.findAll()
      return response.status(200).json(posts)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca uma Postagem armazenada no Banco pelo ID, retorna os dados da Postagem criado e seu relacionamento com status correspondente.
  async findOne (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const postsService = new PostsService()
    try {
      const post = await postsService.findOne(id)
      return response
        .status(200).json({
          ...post
        })
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca uma Postagem armazenada no Banco pelo Slug, retorna os dados do post criado e seu relacionamento com status correspondente.
  async findOneBySlug (request: Request, response: Response): Promise<Response> {
    const { slug } = request.params
    const postsService = new PostsService()
    try {
      const post = await postsService.findOneBySlug(slug)
      return response
        .status(200).json({
          ...post
        })
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Atualiza uma Postagem ja Existente no Banco com os Dados Informados pelo ID passado como parametro, titulo/conteudo passados no corpo da requisição,
  // retorna os dados da Postagem atualizado e seu relacionamento com status correspondente.
  async update (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { title, content } = request.body
    const postsService = new PostsService()
    try {
      const postUpdated = await postsService.update(id, title, content)
      return response
        .status(200).json({
          ...postUpdated
        })
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Exclui uma Postagem pelo ID passado como parametro, retorna o status correspondente.
  async destroy (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const postsService = new PostsService()

    try {
      const isDeleted = await postsService.destroy(id)
      if (!isDeleted.affected) {
        throw new AppError('Não foi Deletado!', 500)
      }
      return response.sendStatus(200)
    } catch (error) {
      throw new AppError(error)
    }
  }
}
export default new PostController()
