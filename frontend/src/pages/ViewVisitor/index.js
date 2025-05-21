import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

export default function ViewVisitor() {
  const { id } = useParams();
  const history = useHistory();
  const [visitor, setVisitor] = useState(null);
  const ongId = localStorage.getItem('ongId');

  useEffect(() => {
    async function fetchVisitor() {
      try {
        const response = await api.get(`/incidents/${id}`, {
          headers: { Authorization: ongId }
        });
        setVisitor(response.data);
      } catch (err) {
        alert('Erro ao buscar o cadastro.');
        history.push('/profile');
      }
    }

    fetchVisitor();
  }, [id, ongId, history]);

  const formatCPF = (cpf) =>
    cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

  const formatTelefone = (tel) =>
    tel.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

  if (!visitor) return null;

  return (
    <div className="view-visitor-container">
      <header>
        <div className="ajuste-Titulo">
          <img src={logoImg} alt="Logo" />
          <span>Bem-vindo(a), {localStorage.getItem('ongName')}</span>
        </div>
        <Link className="back-link" to="/profile">
          <FiArrowLeft size={16} color="#E02041"/>
          Voltar
        </Link>
      </header>

      <div className="content">
        <section className="visitor-details">
          <h1>Visualização de Cadastro</h1>
          <p>Informações detalhadas do visitante.</p>

          <div className="readonly-form">
            <label>Nome</label>
            <input value={visitor.nome} readOnly />

            <label>Data de Nascimento</label>
            <input type="date" value={visitor.nascimento} readOnly />

            <label>CPF</label>
            <input value={formatCPF(visitor.cpf)} readOnly />

            <label>Empresa</label>
            <input value={visitor.empresa} readOnly />

            <label>Setor</label>
            <input value={visitor.setor} readOnly />

            <label>Telefone</label>
            <input value={formatTelefone(visitor.telefone)} readOnly />

            <label>Observação</label>
            <textarea value={visitor.observacao || ''} readOnly />
          </div>
        </section>
      </div>
    </div>
  );
}
