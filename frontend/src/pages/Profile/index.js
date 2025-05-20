import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2, FiUserPlus, FiEdit, FiUsers, FiClock } from 'react-icons/fi'

import api from '../../services/api'

import './styles.css'

import logoImg from '../../assets/logo.svg'

export default function Profile() {
 const [incidents, setIncidents] = useState([])
  const history = useHistory()
  const ongId = localStorage.getItem('ongId')
  const ongName = localStorage.getItem('ongName')

  useEffect(() => {
    api.get('profile', {
      headers: {
        Authorization: ongId,
      }
    }).then(response => {
      setIncidents(response.data)
    })
  }, [ongId])
  
 async function handleDeleteIncident(id) {
  console.log('Botão clicado, ID:', id); // ← Adicione esta linha
  if (!window.confirm('Tem certeza que deseja deletar este cadastro?')) {
    return;
  }

  try {
    const response = await api.delete(`incidents/${id}`, {
      headers: {
        Authorization: ongId,
      }
    });

    if (response.status === 204) {
      setIncidents(incidents.filter(incident => incident.id !== id));
      alert('Cadastro deletado com sucesso!');
    }
  } catch (err) {
    const error = err.response?.data?.error || err.message;
    alert(`Acesso Bloqueado: ${error}`);
  }
}

  async function handleRegisterVisit(id) {
  try {
    // Busca os dados do cadastro
    const incident = incidents.find(inc => inc.id === id);

    if (incident.bloqueado) {
    alert('Este visitante está bloqueado. Registro de visita não permitido.');
    return;
    }
    
    // Envia para a tabela de visitantes
    await api.post('/visitors', {
      name: incident.nome,
      cpf: incident.cpf,
      company: incident.empresa,
      sector: incident.setor
    }, {
      headers: {
        Authorization: ongId
      }
    });

    alert('Visita registrada com sucesso!');
    // Atualiza a lista de visitantes se necessário
    history.push('/visitors');
    
  } catch (err) {
    alert('Erro ao registrar visita: ' + err.message);
  }
  }

  function handleEditProfile(id) {
    history.push(`/incidents/edit/${id}`)
  }

  function handleNavigateToVisitors() {
  history.push('/visitors')
  }

  function handleNavigateToHistory() {
  history.push('/history')
  }

  function handleLogout() {
    localStorage.clear()
    history.push('/')
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="DIME" />
        <span> Bem-vindo(a), {ongName} </span>

        <Link className="button" to="/incidents/new"> Cadastrar Visitante  </Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <div className="page-header">
       <button 
          onClick={handleNavigateToVisitors}
          className="visitors-link"
        >
          <FiUsers size={20} className="icone2"/>
          <span>Ver Visitantes</span>
        </button>
          <button 
            onClick={handleNavigateToHistory}
            className="history-link"
          >
            <FiClock size={20} className="icone"/>
            <span>Histórico</span>
          </button>
      </div>
        <h1>Cadastrados</h1>
      <div className="simple-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nascimento</th>
              <th>CPF</th>
              <th>Empresa</th>
              <th>Setor</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(incident => (
              <tr key={incident.id}>
                <td className={incident.bloqueado ? 'blocked-name' : ''}>{incident.nome}</td>
                <td>{incident.nascimento}</td>
                <td>{incident.cpf}</td>
                <td>{incident.empresa}</td>
                <td>{incident.setor}</td>
                <td>{incident.telefone}</td>
                <td className="actions">
                  <button 
                    onClick={() => handleRegisterVisit(incident.id)} 
                    type="button"
                    aria-label="Registrar visita"
                    className="visit-button"
                  >
                    <FiUserPlus size={16} />
                  </button>
                  <button 
                    onClick={() => handleEditProfile(incident.id)} 
                    type="button"
                    aria-label="Editar perfil"
                    className="edit-button"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIncident(incident.id);
                    }}
                    className="delete-button"
                    title="Deletar cadastro"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
