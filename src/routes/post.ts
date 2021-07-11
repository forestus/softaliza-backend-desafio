import PostController from '@controllers/PostController'
import PostValidator from '@services/Posts/PostValidator'
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated'
import { Router } from 'express'
const router = Router()

// Rotas Publicas
router.get('/', PostController.findAll)
router.get('/:id', PostValidator.validateId, PostController.findOne)
router.get(
  '/slug/:slug',
  PostValidator.validatefindOneBySlug,
  PostController.findOneBySlug
)
// Autenticação de Usuário
router.use(ensureAuthenticated)
// Rotas Privadas
router.post('/', PostValidator.validateStore, PostController.store)
router.put('/:id', PostValidator.validateUpdate, PostController.update)
router.delete('/:id', PostValidator.validateId, PostController.destroy)

export default router
