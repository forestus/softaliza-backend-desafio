import { Router } from 'express'
import userRouter from './user'
import postRouter from './post'
const routes = Router()

// Rotas
routes.use('/posts', postRouter)
routes.use('/users', userRouter)

export default routes
