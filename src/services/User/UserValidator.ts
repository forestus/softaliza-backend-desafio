import { AppError } from '@errors/AppError'
import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'

// Midleware de Validação de Usuários.
// Valida os dados passados para o Controller de Usuário.
// Cada metodo com suas respectivas entradas.
// Caso "required" e "strict: true",
// a entrada de dados será Obrigatória e o tipo estrito se não forem passados de forma correta retorna uma mensagem e status de erro correspondente.
class UserValidator {
  async validateStore (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password_hash } = request.body
    const schema = yup.object().shape({
      username: yup.string().required('Nome Não Informado!'),
      password_hash: yup.string().required('Senha Não Informada!')
    })
    // check validity
    await schema.validate(
      {
        username,
        password_hash
      },
      { abortEarly: false, strict: true }
    )
    next()
  }

  async validateLogin (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password_hash } = request.body
    const schema = yup.object().shape({
      username: yup.string().required('Nome Não Informado!'),
      password_hash: yup.string().required('Senha Não Informada!')
    })
    await schema.validate(
      {
        username,
        password_hash
      },
      { abortEarly: false, strict: true }
    )
    next()
  }

  async validateUpdate (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password_hash } = request.body
    const { id } = request.params
    const schema = yup.object().shape({
      id: yup.string().required('ID Não Informado!'),
      username: yup.string(),
      password_hash: yup.string()
    })
    // check validity
    await schema.validate(
      {
        id,
        username,
        password_hash
      },
      { abortEarly: false, strict: true }
    )
    if (typeof username === 'undefined' && typeof password_hash === 'undefined') {
      throw new AppError('Os Dados do Usuário Não foram Informados!', 400)
    }
    next()
  }

  async validateId (request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params
    const schema = yup.object().shape({
      id: yup.string().required('ID Não Informado!')
    })
    // check validity
    await schema.validate({ id }, { abortEarly: false, strict: true })
    next()
  }
}
export default new UserValidator()
