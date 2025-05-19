  const connection = require('../database/connection')

  module.exports = {
    async index(request, response) {
      const { page = 1 } = request.query

      const [count] = await connection('incidents').count()

      const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5 )
        .select([
          'incidents.*',
          'ongs.name',
          'ongs.birthdate',
          'ongs.cpf',
          'ongs.empresa',
          'ongs.setor',
          'ongs.email',
          'ongs.whatsapp',
          'ongs.city',
          'ongs.uf'
        ])

      response.header('X-Total-Count', count['count(*)'])

      return response.json(incidents)
    },

    async create(request, response) {
      const { nome, nascimento, cpf, empresa, setor, telefone, observacao } = request.body
      const ong_id = request.headers.authorization

      const [id] = await connection('incidents').insert({
        nome,
        nascimento,
        cpf,
        empresa,
        setor,
        telefone,
        observacao,
        ong_id,
      })

      return response.json({ id })
    },

  async delete(request, response) {
  const { id } = request.params;
  const ong_id = request.headers.authorization;

  // Buscar o setor da ONG que está tentando deletar
  const ong = await connection('ongs')
    .where('id', ong_id)
    .select('type')
    .first();

  // Verificar se a ONG existe e se é do Type ADM
  if (!ong || ong.type !== 'ADM') {  // Altere de 'setor' para 'type'
  return response.status(403).json({ 
    error: 'Operação não permitida. Somente administradores podem deletar.' 
  });
  } 

  // Verificar se o incidente existe
  const incident = await connection('incidents')
    .where('id', id)
    .select('id')
    .first();

  if (!incident) {
    return response.status(404).json({ error: 'Incidente não encontrado.' });
  }

  // Deletar incidente
  await connection('incidents').where('id', id).delete();

  return response.status(204).send();
  }
}