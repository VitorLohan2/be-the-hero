const generateUniqueId = require('../utils/generateUniqueId')
const connection  = require('../database/connection')

module.exports = {
  async index(request, response) {
  const ongs = await connection('ongs').select('*')

  return response.json(ongs)
 },

  async create(request, response) {

    const { name, birthdate, cpf, empresa, setor, email, whatsapp, city, uf } = request.body

    // Limpa o CPF (remove pontos e traço)
    const cleanedCpf = cpf.replace(/\D/g, '')

    const id = generateUniqueId()

    await connection('ongs').insert({
      id,
      name,
      birthdate, // Novo campo
      cpf: cleanedCpf, // Novo campo
      empresa, // Novo campo
      setor, // Novo campo
      email,
      whatsapp,
      city,
      uf
    })

    return response.json({ id })
  } 
} 
