"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useConfig } from '../../../../context/ConfigContext';
import Cookies from "js-cookie";
import ClientChat from '@/ecommerce/ClientChat/ClientChat';

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
     
      <ClientChat userName={user.name} />
    </div>
  );
}
