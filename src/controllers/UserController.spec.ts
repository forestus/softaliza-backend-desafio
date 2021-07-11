import { testServer } from '../server.spec'
export async function loginUser (): Promise<any> {
  const signin = await testServer.post('/users/signin')
    .set('Accept', 'application/json')
    .send({ username: 'Guilherme', password_hash: '123456' })
    .expect((response) => {
      JSON.stringify(response)
      expect(response.status).toBe(200)
      expect(typeof response.body).toBe('object')
      if (typeof response.body === 'object') {
        return response.body
      }
    })
  return { signin }
}
describe('UserController', () => {
  // Rota find de Usuários deve retornar 401 se o login sem token JWT
  test('Users find Route should be return 401 if login without token JWT', async () => {
    await testServer.get('/users')
      .set('Accept', 'application/json')
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(401)
      })
  })
  // Rota Signin de Usuários deve retornar 200 e objeto se o login com nome, senha e token JWT
  test('Users Signin Route should be return 200 and object if signin with username and password_hash', async () => {
    const { signin } = await loginUser()
    expect(signin.status).toBe(200)
    expect(typeof signin.body).toBe('object')
  })
  // Rota find de Usuários deve retornar 200 e Array de objetos se logado com token JWT
  test('Users find Route should be return 200, Array of Objects if login with token JWT', async () => {
    const { signin } = await loginUser()
    await testServer.get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(typeof Array(response.body)[0]).toBe('object')
      })
  })
  // Rota findOne de Usuários deve retornar 200 e objeto se obter com id params e fazer login com token JWT
  test('Users findOne Route should be return 200 and Object if get with id params and login with token JWT', async () => {
    const { signin } = await loginUser()
    await testServer.get('/users/1')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe('object')
      })
  })
  // Rota Create de Usuários deve retornar 200 e Object se fizer login com token JWT
  test('Users Create Route should be return 200 and Object if login without token JWT', async () => {
    await testServer.post('/users')
      .set('Accept', 'application/json')
      .send({ username: 'forestus', password_hash: '123456' })
      .expect(async (response) => {
        expect(response.status).toBe(201)
        expect(typeof response.body).toBe('object')
      })
  })
  // Rota Update de Usuários deve retornar 200 e Object se fizer login com token JWT
  test('Users Update Route should be return 200, and Object if login with token JWT', async () => {
    const { signin } = await loginUser()
    await testServer.put('/users/2')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .send({ username: 'forestus7', password_hash: '12345' })
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe('object')
      })
  })
  // Rota Delete de Usuários deve retornar 200 se fizer login com token JWT
  test('Users Delete Route should be return 200, and Object if login with token JWT', async () => {
    const { signin } = await loginUser()
    await testServer.delete('/users/2')
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${signin.body.token}`)
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })
})
