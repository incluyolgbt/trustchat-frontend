import './App.css'
import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './supabase/client';

export default function App() {

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/login')
      } else {
        navigate('/')
      }
    })
  }, [navigate])

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />

      </Routes>
    </>
  );
}

