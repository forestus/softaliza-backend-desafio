import { AppError } from '@errors/AppError'
import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'

// Midleware de Validação de Postagens.
// Valida os dados passados para o Controller de Postagem.
// Cada metodo com suas respectivas entradas.
// Caso "required" e "strict: true",
// a entrada de dados será Obrigatória e o tipo estrito se não forem passados de forma correta retorna uma mensagem e status de erro correspondente.
class PostValidator {
  async validateStore (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { title, content, created_by } = request.body
    const schema = yup.object().shape({
      title: yup.string().required('Titulo Não Informado!'),
      content: yup.string().required('Conteúdo Não Informado!'),
      created_by: yup.string().required('ID de Usuário Não Informado!')
    })
    // check validity
    await schema.validate(
      {
        title,
        content,
        created_by
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
    const { title, content } = request.body
    const { id } = request.params
    const schema = yup.object().shape({
      id: yup.string().required('ID Não Informado!'),
      title: yup.string().required('Titulo Não Informado!'),
      content: yup.string().required('Conteúdo Não Informado!')
    })
    // check validity
    await schema.validate(
      {
        id,
        title,
        content
      },
      { abortEarly: false, strict: true }
    )
    if (typeof title === 'undefined' && typeof content === 'undefined') {
      throw new AppError('Os Dados da Postagem Não foram Informados!', 400)
    }
    next()
  }

  async validatefindOneBySlug (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { slug } = request.params
    const schema = yup.object().shape({
      slug: yup.string().required('Slug Não Informado!')
    })
    // check validity
    await schema.validate(
      {
        slug
      },
      { abortEarly: false, strict: true }
    );
    [...slug].map((character: any) => {
      if (isNaN(character * 1)) {
        if (character !== character.toLowerCase()) {
          throw new AppError('Insira o Slug em Caixa Baixa!', 400)
        }
      }
    })
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
export default new PostValidator()
