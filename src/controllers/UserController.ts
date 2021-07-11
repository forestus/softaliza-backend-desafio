import { Request, Response } from 'express'
import { AppError } from '@errors/AppError'
import { UsersService } from '@services/User/UsersServices'

class UserController {
  // Cria uma novo Usuário recebendo os dados pelo corpo da requisição, retorna os dados do Usuário criado com status correspondente.
  async store (request: Request, response: Response): Promise<Response> {
    const { username, password_hash } = request.body
    const usersService = new UsersService()

    try {
      const user = await usersService.store(username, password_hash)
      return response.status(201).json(user)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca todos os Usuários armazenados no Banco, retorna os dados dos Usuários em uma Array com status correspondente.
  async findAll (request: Request, response: Response): Promise<Response> {
    const usersService = new UsersService()
    try {
      const users = await usersService.findAll()
      return response.status(200).json(users)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca um usuário armazenado no Banco pelo ID, retorna os dados do Usuário criado com status correspondente.
  async findOne (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const usersService = new UsersService()
    try {
      const user = await usersService.findOne(id)
      return response.status(200).json(user)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Cria um token JWT para o usuário realizar a Autenticação, retorna os dados do Usuário e o token JWT.
  async signin (request: Request, response: Response): Promise<Response> {
    const { username, password_hash } = request.body
    const usersService = new UsersService()
    try {
      const login = await usersService.signin(username, password_hash)
      return response.status(200).json(login)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Atualiza Usuário ja Existente no Banco com os Dados Informados pelo ID passado como parametro, username/password_hash passados no corpo da requisição,
  // retorna os dados do Usuário atualizado com status correspondente.
  async update (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { username, password_hash } = request.body
    const usersService = new UsersService()
    try {
      const user = await usersService.update(id, username, password_hash)
      return response
        .json({
          ...user
        })
        .status(200)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Exclui um Usuário pelo ID passado como parametro, retorna o status correspondente.
  async destroy (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const usersService = new UsersService()

    try {
      const isDeleted = await usersService.destroy(id)
      if (!isDeleted.affected) {
        throw new AppError('Não foi Deletado!', 500)
      }
      return response.sendStatus(200)
    } catch (error) {
      throw new AppError(error)
    }
  }
}
export default new UserController()
