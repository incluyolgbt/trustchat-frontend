import './App.css'
import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';
import {Chats} from './pages/Chats';
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
        navigate('/conversations')
      }
    })
  }, [navigate])

  return (
    <>
      <Routes>
        <Route path='/conversation' element={<Chat />} />
        <Route path='/login' element={<Login />} />
        <Route path='/conversations' element={<Chats/>}/>
        <Route path='*' element={<NotFound />} />

      </Routes>
    </>
  );
}

