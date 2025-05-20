const connection = require('../database/connection');

module.exports = {
  // Listagem paginada
  async index(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
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
      ]);

    response.header('X-Total-Count', count['count(*)']);
    return response.json(incidents);
  },

  // Criação de incidente
  async create(request, response) {
    const { nome, nascimento, cpf, empresa, setor, telefone, observacao } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({
      nome,
      nascimento,
      cpf,
      empresa,
      setor,
      telefone,
      observacao,
      ong_id,
    });

    return response.json({ id });
  },

  // Buscar incidente específico (para edição)
  async show(request, response) {
    const { id } = request.params;

    try {
      const incident = await connection('incidents')
        .where('id', id)
        .select('*')
        .first();

      if (!incident) {
        return response.status(404).json({ error: 'Cadastro não encontrado.' });
      }

      return response.json(incident);
    } catch (err) {
      return response.status(500).json({ error: 'Erro ao buscar cadastro.' });
    }
  },

// Atualizar incidente
async update(request, response) {
  const { id } = request.params;
  const ong_id = request.headers.authorization;

  const {
    nome,
    nascimento,
    cpf,
    empresa,
    setor,
    telefone,
    observacao,
    bloqueado // <- novo campo
  } = request.body;

  try {
    const incident = await connection('incidents')
      .where('id', id)
      .first();

    if (!incident) {
      return response.status(404).json({ error: 'Cadastro não encontrado.' });
    }

    // Se estiver tentando alterar "bloqueado", precisa ser ADM
    if (typeof bloqueado !== 'undefined') {
      const ong = await connection('ongs')
        .where('id', ong_id)
        .select('type')
        .first();

      if (!ong || ong.type !== 'ADM') {
        return response.status(403).json({ error: 'Somente administradores podem alterar o status de bloqueio.' });
      }
    }

    await connection('incidents')
      .where('id', id)
      .update({
        nome,
        nascimento,
        cpf,
        empresa,
        setor,
        telefone,
        observacao,
        ...(typeof bloqueado !== 'undefined' && { bloqueado: !!bloqueado })
      });

    return response.status(204).send();
  } catch (err) {
    return response.status(500).json({ error: 'Erro ao atualizar cadastro.' });
  }
},

  // Deletar incidente (somente se for ADM)
  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const ong = await connection('ongs')
      .where('id', ong_id)
      .select('type')
      .first();

    if (!ong || ong.type !== 'ADM') {
      return response.status(403).json({
        error: 'Somente administradores.'
      });
    }

    const incident = await connection('incidents')
      .where('id', id)
      .select('id')
      .first();

    if (!incident) {
      return response.status(404).json({ error: 'Incidente não encontrado.' });
    }

    await connection('incidents').where('id', id).delete();

    return response.status(204).send();
  }
};
