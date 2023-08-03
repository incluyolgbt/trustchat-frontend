import './App.css'
import { useState, useEffect } from 'react';
import { Login } from '../pages/Login';
import { Chat } from '../pages/Chat';
import { Chats } from '../pages/Chats';
import { NotFound } from '../pages/NotFound';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Context, ContextProvider } from '../Context';
import { Loading } from '../pages/Loading';

export default function App() {

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/login')
      }
    })
  }, [navigate])

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='/conversation/:slug' element={<Chat />} />
        <Route path='/conversations' element={<Chats />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

