import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useConfig } from '../context/ConfigContext';
import { useAtom } from 'jotai';
import { storeID } from '../../../store/store';
import styles from "./SignUpForm.module.css"

const Signup = () => {
  const { apiUrl } = useConfig();
  const [storeIDAtom, setStoreID] = useAtom(storeID);
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie

  console.log('storeIDAtom', storeIDAtom);
  console.log('UserID', UserID);
    const savedUserID = Cookies.get("UserID");
  const [showCEP, setShowCEP] = useState(false);
  const [formData, setFormData] = useState({
    storeID: storeIDAtom, 
    userID: UserID, 
    name: '',
    mobilePhone: '',
    email: '',
    postalCode: '',
    address: '',
    addressNumber: '',
    complement: '',
    province: '',
    city: '',
    state: '',
  });

  const [message, setMessage] = useState('');

  // Recuperar storeID e userID do cookie
  useEffect(() => {
    const savedStoreID = Cookies.get("storeID");
    const savedUserID = Cookies.get("UserID");

    if (savedStoreID && !storeIDAtom) {
      setStoreID(savedStoreID);
      setFormData(prevState => ({ ...prevState, storeID: savedStoreID }));
    } else if (storeIDAtom) {
      setFormData(prevState => ({ ...prevState, storeID: storeIDAtom }));
    }

    if (savedUserID) {
      setFormData(prevState => ({ ...prevState, userID: savedUserID }));
    }
  }, [storeIDAtom, setStoreID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Certifique-se de que o userID e o storeID estão presentes antes de enviar o formulário
    if (!formData.userID || !formData.storeID) {
      setMessage('Erro: ID de usuário ou loja ausente.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/signupUser`, formData);
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Erro ao criar usuário.');
      }
    }
  };

  const handleCepChange = async (event) => {
    const newCep = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setFormData({ ...formData, postalCode: newCep });

    if (newCep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${newCep}/json/`);
        const data = response.data;
        if (!data.erro) {
          setFormData(prevFormData => ({
            ...prevFormData,
            address: data.logradouro,
            complement: data.complemento,
            province: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
          setShowCEP(true);
        } else {
          setShowCEP(false);
        }
      } catch (error) {
        setShowCEP(false);
        console.error("Erro ao buscar endereço:", error);
      }
    }
  };

  return (
    <div>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome" onChange={handleChange} value={formData.name} required />
        <input type="text" name="mobilePhone" placeholder="Telefone" onChange={handleChange} value={formData.mobilePhone} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
        <input
          type="text"
          name="postalCode"
          onChange={handleCepChange}
          value={formData.postalCode}
          placeholder="77777-777"
          className={styles.input}
        />
        <button type="submit">Cadastrar</button>
      </form>
      {showCEP && (
        <>
          <input type="text" name="address" placeholder="Endereço" onChange={handleChange} value={formData.address} />
          <input type="text" name="addressNumber" placeholder="Número" onChange={handleChange} value={formData.addressNumber} required />
          <input type="text" name="complement" placeholder="Complemento" onChange={handleChange} value={formData.complement} />
          <input type="text" name="province" placeholder="Bairro" onChange={handleChange} value={formData.province} />
          <input type="text" name="city" placeholder="Cidade" onChange={handleChange} value={formData.city} />
          <input type="text" name="state" placeholder="Estado" onChange={handleChange} value={formData.state} />
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
