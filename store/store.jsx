

import { atom } from 'jotai';
import Cookies from 'js-cookie';

export const loggedInAtom = atom(Boolean(Cookies.get('token')));
export const isAdminAtom = atom(Cookies.get('role') === 'administrador');
export const AdminIDAtom = atom(null); // Defina o AdminIDAtom

export const loggedInCustomerAtom = atom(Boolean(Cookies.get('token')));
export const isCustomerAtom = atom(Cookies.get('role') === 'User');
export const customerIDAtom = atom(null); // Defina o AdminIDAt
export const authErrorAtom = atom(null); // Novo átomo para armazenar erros de autenticação




// Defina átomos para cada cor do tema
export const headerBackgroundColorAtom = atom('#ffffff');
export const headerColorAtom = atom('#000000');
export const mainBackgroundColorAtom = atom('#ffffff');
export const mainColorAtom = atom('#000000');
export const footerBackgroundColorAtom = atom('#ffffff');
export const footerColorAtom = atom('#000000');

export const storeID = atom(null); // Inicialmente, o ID é nulo

// Átomo para armazenar o token
export const authTokenAtom = atom(Cookies.get('token') || null);

// Átomo para armazenar o usuário
export const authAtom = atom(null);
// receitasAtom.js


export const receitasAtom = atom([]);
// Átomo para atualizar o estado de autenticação
export const updateAuthAtom = atom(
  (get) => get(authAtom),
  (updateAuth, newUser) => {
    // Atualize o estado do usuário
    updateAuth(newUser);

    // Armazene o token em cookies e no estado
    const token = newUser.token; // Supondo que você recebe o token do login
    Cookies.set('token', token, { expires: 1 }); // Armazena o token em cookies por 1 dia
  }
);