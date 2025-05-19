import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');
  const history = useHistory();

  useEffect(() => {
    api.get('history', {
      headers: {
        Authorization: ongId,
      }
    }).then(response => {
      setHistoryData(response.data);
    });
  }, [ongId]);

  return (
    <div className="visitors-container">
      <header>
        <div className="ajuste-Titulo">
        <img src={logoImg} alt="DIME" />
        <span>Bem-vindo(a), {ongName}</span>
        </div>
        <Link className="back-link" to="/profile">
          <FiArrowLeft size={16} color="#E02041" />
          Voltar
        </Link>
      </header>

      <div className="content">
        <section className="visitors-history">
          <h1>Histórico</h1>
          <h2>Visitantes com visita encerrada</h2>

          {historyData.length === 0 ? (
            <p className="no-visitors">Nenhuma visita encerrada até o momento.</p>
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
                </tr>
              </thead>
              <tbody>
                {historyData.map((visitor, index) => (
                  <tr key={visitor.id}>
                    <td>{index + 1}</td>
                    <td>{visitor.name || 'Não informado'}</td>
                    <td>{visitor.cpf || 'Não informado'}</td>
                    <td>{visitor.company || visitor.empresa || 'Não informado'}</td>
                    <td>{visitor.sector || visitor.setor || 'Não informado'}</td>
                    <td>
                      {visitor.entry_date ? 
                        new Date(visitor.entry_date).toLocaleString() : 
                        new Date(visitor.created_at).toLocaleString()
                      }
                    </td>
                    <td>
                      {visitor.exit_date ? 
                        new Date(visitor.exit_date).toLocaleString() : 
                        'Não informado'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
