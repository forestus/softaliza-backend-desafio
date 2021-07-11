import { AppError } from '@errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
const key = '4f93ac9d10cb751b8c9c646bc9dbccb9'

async function ensureAuthenticated (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> {
  // Pega o Bearer Token passado nos Headers da Requisição para Autenticação.
  const { authorization } = request.headers
  // Caso não passado o Token JWT, retorna status e mensagem de erro.
  if (!authorization) {
    return response.sendStatus(401).end()
  }
  // formata o token.
  const [, token] = authorization.split(' ')
  // verifica se o token ainda é válido, caso válido chama a próxima execução, caso falso retorna status e mensagem de erro.
  try {
    verify(token, key)
    return _next()
  } catch (error) {
    throw new AppError('Não Autorizado!', 401)
  }
}
export { ensureAuthenticated }
