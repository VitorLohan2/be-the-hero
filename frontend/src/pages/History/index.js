import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function History() {
  const [visits, setVisits] = useState([]);
  const history = useHistory();
  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  useEffect(() => {
    api.get('history', {
      headers: {
        Authorization: ongId,
      }
    }).then(response => {
      setVisits(response.data);
    });
  }, [ongId]);

  return (
    <div className="history-container">
      <header>
        <img src={logoImg} alt="DIME" />
        <span>Bem-vindo(a), {ongName}</span>
        
        <Link className="back-link" to="/profile">
          <FiArrowLeft size={16} color="#E02041" />
          Voltar para perfil
        </Link>
      </header>

      <div className="content">
        <section className="history-list">
          <h1>Histórico Completo</h1>
          <h2>Registro de todas as visitas</h2>

          {visits.length === 0 ? (
            <p className="no-visits">Nenhuma visita registrada no histórico.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Empresa</th>
                  <th>Setor</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Tempo</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit, index) => {
                  const entryDate = new Date(visit.entry_date);
                  const exitDate = new Date(visit.exit_date);
                  const duration = Math.floor((exitDate - entryDate) / (1000 * 60)); // minutos
                  
                  return (
                    <tr key={visit.id}>
                      <td>{index + 1}</td>
                      <td>{visit.name || 'Não informado'}</td>
                      <td>{visit.cpf || 'Não informado'}</td>
                      <td>{visit.company || 'Não informado'}</td>
                      <td>{visit.sector || 'Não informado'}</td>
                      <td>{entryDate.toLocaleString()}</td>
                      <td>{exitDate.toLocaleString()}</td>
                      <td>{duration} minutos</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}