import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const history = useHistory();
  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  useEffect(() => {
    api.get('visitors', {
      headers: {
        Authorization: ongId,
      }
    }).then(response => {
      setVisitors(response.data);
    });
  }, [ongId]);

  return (
    <div className="visitors-container">
      <header>
        <img src={logoImg} alt="DIME" />
        <span>Bem-vindo(a), {ongName}</span>
        
        <Link className="back-link" to="/profile">
          <FiArrowLeft size={16} color="#E02041" />
          Voltar
        </Link>
      </header>

      <div className="content">
        <section className="visitors-history">
          <h1>Visitantes</h1>
          <h2>Histórico de visitas</h2>

          {visitors.length === 0 ? (
            <p className="no-visitors">Nenhum visitante cadastrado ainda.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Empresa</th>
                  <th>Setor</th>
                  <th>Data/Hora Entrada</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor, index) => (
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