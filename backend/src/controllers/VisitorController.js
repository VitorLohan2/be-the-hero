const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const ong_id = request.headers.authorization;

    const visitors = await connection('visitors')
      .where('ong_id', ong_id)
      .select([
        'id',
        'name',
        'cpf',
        'company',
        'sector',
        'entry_date',
        'created_at'
      ]);

    return response.json(visitors);
  },

  async create(request, response) {
    const { name, cpf, company, sector } = request.body;
    const ong_id = request.headers.authorization;
    const entry_date = new Date(); // Registra a data/hora atual

    const [id] = await connection('visitors').insert({
      name,
      cpf,
      company,
      sector,
      entry_date,
      ong_id,
    });

    return response.json({ id, entry_date });
  }
};