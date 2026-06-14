import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import './styles/global.css';
import { isAuthenticated } from './services/authService';

import AppLayout from './components/AppLayout';


function App() {

  return (
    <BrowserRouter>
      <AppLayout/>
    </BrowserRouter>
  );
}

export default App
