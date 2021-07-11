import { DeleteResult, getCustomRepository, Repository } from 'typeorm'
import { UserEntity } from '@entities/UserEntity'
import { UsersRepository } from '@repositories/UsersRepository'
import { AppError } from '@errors/AppError'
import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const key = '4f93ac9d10cb751b8c9c646bc9dbccb9'

interface ILogin {
  user: UserEntity
  token: string
}

class UsersService {
  private readonly usersRepository: Repository<UserEntity>
  // O Constructor salva os repositórios na variável acima para reutilizar em todos os métodos do Serviço.
  constructor () {
    this.usersRepository = getCustomRepository(UsersRepository)
  }

  async store (username: string, password_hash: string): Promise<UserEntity> {
    // Busca no banco o Usuário com o Nome de Usuário do mesmo.
    const userAlreadyExists = await this.usersRepository.findOne({ username })
    // Se o Usuário já existe, retorna status e mensagem de erro.
    if (userAlreadyExists != null) {
      throw new AppError('Este Usuário Já Existe!', 409)
    }
    // Tenta salvar no banco O Usuário, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade do Usuário passando os dados passados pela requisição.
      const userData = this.usersRepository.create({
        username,
        password_hash
      })
      // Salva a entidade no banco.
      const user = await this.usersRepository.save(userData)
      // Apaga a senha do Usuário e depois o retorna para o Controller.
      delete (user as any).password_hash
      return user
    } catch (error) {
      throw new AppError(error)
    }
  }

  async findAll (): Promise<UserEntity[]> {
    // Busca no banco todos os Usuários.
    const users = await this.usersRepository.find()
    // Se nenhum Usuário for encontrado, retorna status e mensagem de erro.
    if (!users) {
      throw new AppError('Usuário não Encontrado!', 404)
    }
    // Exclui as senhas dos usuários e logo após retorna a Array para o Controller.
    users.map((user) => {
      delete (user as any).password_hash
      return { ...user }
    })
    return users
  }

  async findOne (id: string): Promise<UserEntity> {
    // Busca no banco o Usuário com id do mesmo.
    const user = await this.usersRepository.findOne({ id })
    // Se o Usuário não Existe, retorna status e mensagem de erro.
    if (!user) {
      throw new AppError('Usuário não Encontrado!', 404)
    }
    // Apaga a senha do Usuário e depois o retorna para o Controller.
    delete (user as any).password_hash
    return user
  }

  async signin (username: string, password_hash: string): Promise<ILogin> {
    // Busca no banco o Usuário com id do mesmo.
    const user = await this.usersRepository.findOne({ username })
    // Se o Usuário não Existe, retorna status e mensagem de erro.
    if (user == null) {
      throw new AppError('Usuário não Encontrado!', 404)
    }
    // Compara a senha recebida na requisição com a senha(Hash) já existente do usuário, retorna true ou false.
    const condition = await bcrypt.compare(
      String(password_hash),
      user.password_hash
    )
    // Caso a comparação acima seja falsa, ou seja, esteja incorreta retorna status e mensagem de erro.
    if (!condition) {
      throw new AppError('Senha Incorreta!', 400)
    }
    // cria um Token JWT a partir do ID de usuário passado como payload, subject e uma chave "key", expira em 1 hora.
    const token = jwt.sign({ payloadId: user.id }, key, {
      subject: String(user.id),
      expiresIn: '1h'
    })
    // Remove a senha do usuário que se Autenticou e logo após retorna para o Controller o Usuário e Token de Autenticação.
    delete (user as any).password_hash
    return { user, token }
  }

  async update (id: string, username: string, password_hash: string): Promise<UserEntity> {
    // Busca no banco o Usuário pelo ID do mesmo, retorna o Usuário.
    const user = await this.usersRepository.findOne({ id })
    // Busca no banco o Usuário pelo Nome do mesmo, retorna o Usuário.
    const usernameAlreadyExists = await this.usersRepository.findOne({
      username
    })
    // Se o Usuário não existe, retorna status e mensagem de erro.
    if (user == null) {
      throw new AppError('Usuário não Encontrado!', 404)
    }
    // Se o nome do Usuário Já Existe, retorna status e mensagem de erro.
    if (usernameAlreadyExists != null) {
      throw new AppError('Este Nome de usuário Já Existe!', 409)
    }
    // Se os dados a serem persistidos no banco forem os mesmos, retorna status e mensagem de erro.
    if (user.username === username && user.password_hash === password_hash) {
      throw new AppError('Usuário já possui os Dados Informados!', 409)
    }
    // Caso nome de usuário/senha sejam passados ele os salva na váriavel, caso não ele persiste o valor antigo.
    typeof username !== 'undefined' &&
      user.username !== username &&
      (user.username = username)
    typeof password_hash !== 'undefined' &&
      user.password_hash !== password_hash &&
      (user.password_hash = password_hash)
    // Tenta salvar no banco o Usuário Atualizado, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade do Usuário.
      const userData = this.usersRepository.create(user)
      // Atualiza a entidade no banco.
      await this.usersRepository.update(id, { ...userData })
      // Apaga a senha do Usuário e depois o retorna para o Controller.
      delete (user as any).password_hash
      return user
    } catch (error) {
      throw new AppError(error)
    }
  }

  async destroy (id: string): Promise<DeleteResult> {
    // Busca no banco o Usuário com id do mesmo, retorna o mesmo.
    const userAlreadyExists = await this.usersRepository.findOne({ id })
    // Se o Usuário não existe, retorna status e mensagem de erro.
    if (userAlreadyExists == null) {
      throw new AppError('Usuário não Encontrado!', 404)
    }
    // Tenta Excluir no banco o Usuário pelo id passado, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Apaga a entidade pelo ID passado e logo após retorna o Resultado para o Controller.
      const deleted = await this.usersRepository.delete(userAlreadyExists.id)
      return deleted
    } catch (error) {
      throw new AppError(error)
    }
  }
}

export { UsersService }
