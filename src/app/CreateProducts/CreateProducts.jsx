import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useConfig } from '../../../context/ConfigContext';
import Cookies from "js-cookie";

export default function Products() {
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
 
  const [storeID, setStoreID] = useState(null);

  const [formData, setFormData] = useState({
    adminID: AdminID,
    storeID: null, // Inicialmente null, será atualizado quando o storeID for recuperado
    name: '',
    price: '',
    imageUrl: '',
    category: '',
    variations: [] // Inicialmente vazio, será preenchido com variações
  });

  async function handleGetEcommerce() {
    try {
      const response = await axios.get(`${apiUrl}/api/loja/admin/${AdminID}`);
      setStoreID(response.data._id);

      // Atualize o formData com o storeID assim que ele for recuperado
      setFormData((prevFormData) => ({
        ...prevFormData,
        storeID: response.data._id,
      }));
    } catch (error) {
      console.error("Error showing ecommerce:", error);
    }
  }

  useEffect(() => {
    handleGetEcommerce();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    const newVariations = [...formData.variations];
    newVariations[index] = {
      ...newVariations[index],
      [name]: value
    };
    setFormData({
      ...formData,
      variations: newVariations
    });
  };

  const handleAddField = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      variations: [...prevFormData.variations, { url: '', price: '', name: '' }] // Adiciona um novo campo vazio
    }));
  };

  const handleRemoveField = (index) => {
    setFormData(prevFormData => {
      const newVariations = prevFormData.variations.filter((_, i) => i !== index);
      return {
        ...prevFormData,
        variations: newVariations
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.storeID) {
      alert('Store ID ainda não foi carregado.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/products`, formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Erro ao criar produto.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginTop: '5rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          onChange={handleChange}
          value={formData.category}
          required
        />
         <input
          type="text"
          name="imageUrl"
          placeholder="imagem"
          onChange={handleChange}
          value={formData.imageUrl }
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Preço"
          onChange={handleChange}
          value={formData.price}
          required
        />

        <button type="button" onClick={handleAddField} style={{ marginTop: '10px' }}>
          Adicionar Variação
        </button>

        {formData.variations.map((variation, index) => (
          <div key={index} style={{ marginBottom: '10px', marginTop: '2rem', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={variation.url}
              onChange={(e) => handleVariationChange(index, e)}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Nome da Variação"
              value={variation.name}
              onChange={(e) => handleVariationChange(index, e)}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Preço"
              value={variation.price}
              onChange={(e) => handleVariationChange(index, e)}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveField(index)}
              style={{
                marginLeft: '10px',
                backgroundColor: '#DC143C',
                color: 'white',
                border: 'none',
                padding: '.5rem',
                borderRadius: '1rem',
                fontFamily: 'poppins',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '.8rem',
                whiteSpace: 'nowrap',
                marginTop: '10px'
              }}
            >
              Remover
            </button>
          </div>
        ))}

        <button type="submit" style={{ marginTop: '10px' }}>Cadastrar</button>
      </form>
    </>
  );
}
