"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useConfig } from '../../../../context/ConfigContext';
import Cookies from "js-cookie";
import ClientChat from '@/ecommerce/ClientChat/ClientChat';

export default function UserFormContainer() {
    const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
    const UserName = Cookies.get("UserName"); // Obtenha o ID do cliente do cookie


  return (
    <div>
     
      <ClientChat userName={UserName} />
    </div>
  );
}
