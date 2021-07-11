import { createConnection, getConnectionOptions, Connection } from 'typeorm'
import InsertData from '@database/InsertData'
export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions()
  // Cria a Conexão com o Banco de Dados, default Options representa as configurações passadas no ormconfig.json.
  // Caso necessário é possível inserir um banco de teste apenas passando o nome e configurando a enviroment.
  const connection = await createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'teste' // if want to switch db
          ? 'teste-db'
          : defaultOptions.database
    })
  ).then(async (connection) => {
    // Faz a População Inicial do banco passando o Usuário e as Postagens e Logo Após Retorna a conexão.
    await InsertData.insertUser()
    await InsertData.insertPosts().then(() => {
      console.log('População de BlogPosts OK!')
    })
    return connection
  })
  return connection
}
