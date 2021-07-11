import { AppError } from '@errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup'
import { QueryFailedError } from 'typeorm/error'
import translate from '@vitalets/google-translate-api'
async function errorMiddleware (
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<Response> {
  // Error Handring em teste, caso o nome do error seja QueryFailedError ele ira imprimir o mesmo e
  // confirmar se a variavel recebeu o tipo adequado ao mesmo corretamente.
  if (err.constructor.name === 'QueryFailedError') {
    const teste = { ...err } as QueryFailedError
    console.log(teste)
    console.log(teste instanceof QueryFailedError)
  }
  // caso o Erro seja uma Instancia do Erro de Validação do Yup ele filtra e devolve uma mensagem, caso o erro não seja do tipo "typeError" ele traduz e retorna o erro,
  // caso não seja um "typeError" ele traduz e retorna.
  if (err instanceof ValidationError) {
    if (err.inner[0].type === 'typeError') {
      return response
        .json({
          error: await Promise.all(
            err.inner.map(async (error) => {
              if (error.type === 'typeError') {
                return `O Parametro passado "${(error.value as string)}" não condiz com o tipo Necessário!`
              } else {
                return await Promise.all(
                  err.errors.map(async (error) => {
                    const translateToPt = await translate(error, { to: 'pt' })
                    return translateToPt.text
                  })
                )
              }
            })
          )
        })
        .status(400)
    } else {
      return response.status(400).json({
        error: await Promise.all(
          err.errors.map(async (error) => {
            const translateToPt = await translate(error, { to: 'pt' })
            return translateToPt.text
          })
        )
      })
    }
  }
  // caso seja uma instancia de AppError ele formata o Error e retorna o mesmo.
  if (err instanceof AppError) {
    return response.status(err.message.statusCode || err.statusCode).json({
      error: [err.message.message ? err.message.message : err.message]
    })
  }
  // caso não seja nenhuma das Instancias acima ele retorna o Erro 500 e a mensagem no corpo.
  return response.status(500).json({
    error: `Erro Interno do Servidor! - ${err.message}`
  })
}
export { errorMiddleware }
