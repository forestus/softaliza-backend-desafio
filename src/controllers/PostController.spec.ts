import { testServer } from '../server.spec'
import { loginUser } from './UserController.spec'
describe('PostController', () => {
  // A rota find das postagens deve ter o retorno 200 e a resposta Array de Objetos se get / posts
  test('Posts find Route should be return 200 and response if get /posts', async () => {
    await testServer.get('/posts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(typeof Array(response.body)[0]).toBe('object')
      })
  })
  // A rota findOne das postagens deve ter o retorno 200 e a resposta Objeto se get / posts passando ID
  test('Posts findOne Route should be return 200 and response if get /posts with id params', async () => {
    await testServer.get('/posts/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })
  // A rota findOneBySlug das postagens deve ter o retorno 200 e a resposta Objeto se get /posts/slug  passando Slug
  test('Posts findOneBySlug Route should be return 200 and response if get /posts/slug with slug params', async () => {
    await testServer.get('/posts/slug/nodejs-rumo-ao-junior-na-softaliza!!')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })
  // A rota create das postagens deve ter o retorno 200 e a resposta Objeto se post / posts
  test('Posts create Route should be return 200 and response if get /posts with id params', async () => {
    const { signin } = await loginUser()
    await testServer.post('/posts')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .send(
        {
          title: 'Nodejs e Express :v',
          content: 'É muito Simples fazer uma Rota!',
          created_by: '1'
        }
      )
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(201)
        expect(typeof response.body).toBe('object')
      })
  })
  // A rota update das postagens deve ter o retorno 200 e a resposta Objeto se put / posts passando ID
  test('Posts update Route should be return 200 and response if get /posts with id params', async () => {
    const { signin } = await loginUser()
    await testServer.put('/posts/4')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .send(
        {
          title: 'Rumo ao Nest! :v',
          content: 'La não é Simples fazer uma Rota!',
          created_by: '1'
        }
      )
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe('object')
      })
  })
  // A rota create das postagens deve ter o retorno 200 delete / posts passando ID

  test('Posts delete Route should be return 200 and response if get /posts with id params', async () => {
    const { signin } = await loginUser()
    await testServer.delete('/posts/4')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })
})
