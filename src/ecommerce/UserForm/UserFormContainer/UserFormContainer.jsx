"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useConfig } from '../../../../context/ConfigContext';
import Cookies from "js-cookie";

export default function UserFormContainer() {
    const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie

  const [user, setUser] = useState(null); // Armazena os dados do usuário
  const [isRegistered, setIsRegistered ] = useState(null); // Armazena os dados do usuário

  const [loading, setLoading] = useState(true); // Armazena o estado de carregamento
  const [error, setError] = useState(null); // Armazena qualquer erro
  const { apiUrl } = useConfig();

  // Função que busca os dados do usuário
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/userForm/${UserID}`); // Substitua pelo userID dinâmico se necessário
      setUser(response.data); // Armazena os dados do usuário
      
      setLoading(false); // Desativa o carregamento
      setIsRegistered(response.data.isRegistered)
      console.log(response.data.isRegistered)
    } catch (err) {
      setError('Erro ao carregar os dados do usuário'); // Armazena o erro
      setLoading(false);
    }
  };

  // Executa a função de busca quando o componente é montado
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>Dados do Usuário</h1>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.mobilePhone}</p>
          <p><strong>Endereço:</strong> {user.address}, {user.addressNumber}, {user.city} - {user.state}</p>
          <p><strong>CEP:</strong> {user.postalCode}</p>
          {/* Renderize mais informações do usuário conforme necessário */}
        </div>
      ) : (
        <p>Usuário não encontrado.</p>
      )}
    </div>
  );
}
