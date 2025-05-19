import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';
import logoImg from '../../assets/logo.svg';

export default function NewVisitor() {
  const [form, setForm] = useState({
    nome: '',
    nascimento: '',
    cpf: '',
    empresa: '',
    setor: '',
    telefone: '',
    observacao: ''
  });

  const history = useHistory();

  const empresas = ["Dime", "Dimep", "Dime Saúde"];
  const setores = ["Reunião", "Entrega", "Visita"];

  const handleChange = (e) => {
  const { name, value } = e.target;
  const newValue = name === 'nome' ? value.toUpperCase() : value;
  setForm(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.cpf.replace(/\D/g, '').length !== 11) {
      return alert('CPF inválido');
    }

    try {
      await api.post('/incidents', form, {
        headers: {
          Authorization: localStorage.getItem('ongId')
        }
      });
      alert('Visitante cadastrado!');
      history.push('/profile');
    } catch (err) {
      alert('Erro no cadastro');
    }
  };

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Logo" width="350px"/>
          <h1>Cadastrar Visitante</h1>
          <p>Informe os dados do visitante.</p>
          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#e02041"/>
            Voltar
          </Link>
        </section>

        <form onSubmit={handleSubmit}>
          <input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="nascimento"
            value={form.nascimento}
            onChange={handleChange}
            required
          />

          <input
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 11) {
                const formatted = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                handleChange({ target: { name: 'cpf', value: formatted } });
              }
            }}
            maxLength={14}
            required
          />

          <select
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            required
          >
            <option value="">Empresa</option>
            {empresas.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            name="setor"
            value={form.setor}
            onChange={handleChange}
            required
          >
            <option value="">Setor</option>
            {setores.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>

          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <textarea
            name="observacao"
            placeholder="Observações"
            value={form.observacao}
            onChange={handleChange}
          />

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
