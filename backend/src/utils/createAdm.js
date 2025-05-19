const path = require('path');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '../../src/database/db.sqlite') // Caminho absoluto
  },
  useNullAsDefault: true
});
const generateUniqueId = require('./generateUniqueId');

async function createAdm() {
  const admData = {
    id: generateUniqueId(),
    name: 'VITOR LOHAN',
    birthdate: '1998-08-06',
    cpf: '16677652726',
    empresa: 'DIME',
    setor: 'TI',
    email: 'adm@email.com',
    whatsapp: '21983867486',
    city: 'Rio de Janeiro',
    uf: 'RJ',
    type: 'ADM'
  };

  try {
    await knex('ongs').insert(admData);
    console.log('✅ ADM criado com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await knex.destroy(); // Fecha a conexão
  }
}

createAdm();