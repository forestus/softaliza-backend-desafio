import UserController from '@controllers/UserController'
import UserValidator from '@services/Users/UserValidator'
import { Router } from 'express'
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated'
const router = Router()

// Rotas Publicas
router.post('/signin', UserValidator.validateLogin, UserController.signin)
router.post('/', UserValidator.validateStore, UserController.store)
// Autenticação de Usuário
router.use(ensureAuthenticated)
// Rotas Privadas
router.get('/', UserController.findAll)
router.get('/:id', UserValidator.validateId, UserController.findOne)
router.put('/:id', UserValidator.validateUpdate, UserController.update)
router.delete('/:id', UserValidator.validateId, UserController.destroy)

export default router
