const express = require('express')
const { celebrate, Segments, Joi } = require('celebrate')

const OngController = require('./controllers/OngController')
const IncidentController = require('./controllers/IncidentController')
const ProfileController = require('./controllers/ProfileController')
const SessionController = require('./controllers/SessionController')
const VisitorController = require('./controllers/VisitorController');
const upload = require('./config/multer');


const routes = express.Router()

routes.post('/sessions', SessionController.create)

routes.get('/ongs', OngController.index)
routes.post('/ongs', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    birthdate: Joi.string().required(), // Adicionando data de nascimento
    cpf: Joi.string().required().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/), // Adicionando CPF (11 dígitos)
    empresa: Joi.string().required(), // Adicionando empresa
    setor: Joi.string().required(), // Adicionando setor
    email: Joi.string().required().email(),
    whatsapp: Joi.string().required().min(10).max(11),
    city: Joi.string().required(),
    uf: Joi.string().required().length(2)
  })
}), OngController.create)

routes.get('/profile', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), ProfileController.index)

routes.get('/incidents', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number(),
  })
}), IncidentController.index)

routes.post('/incidents', IncidentController.create)



routes.delete('/incidents/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),          // Valida que o ID é um número
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),   // Exige o token de autorização (ong_id)
  }).unknown(),   // Permite outros headers além do 'authorization'
}), IncidentController.delete)

routes.get('/visitors', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), VisitorController.index);

routes.post('/visitors', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    cpf: Joi.string().required(),
    company: Joi.string().required(),
    sector: Joi.string().required()
  })
}), VisitorController.create);

// Encerrar visita
routes.put('/visitors/:id/exit',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown()
  }),
  VisitorController.endVisit
);

// Buscar histórico
routes.get('/history',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown()
  }),
  VisitorController.history
);

routes.get('/incidents/:id', IncidentController.show);

routes.put('/incidents/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(), // Certifique-se de que o ID seja um número
    }),
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().required(),
      nascimento: Joi.string().required(),
      cpf: Joi.string().required(),
      empresa: Joi.string().required(),
      setor: Joi.string().required(),
      telefone: Joi.string().required(),
      observacao: Joi.string().allow('', null),
      bloqueado: Joi.boolean().optional()
    })
  }),
  IncidentController.update
);

// Rota dedicada apenas para bloqueio (similar à rota de delete)
routes.put('/incidents/:id/block',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(), // Mantemos a autorização
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
      bloqueado: Joi.boolean().required() // Campo obrigatório
    })
  }),
  IncidentController.blockIncident // Novo método no controller
);

module.exports = routes
