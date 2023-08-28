import './App.css'
import { useState, useEffect } from 'react';
import { Login } from '../Components/Login';
import { Chat } from './pages/Chat';
import { Chats } from './pages/Chats';
import { NotFound } from '../Components/NotFound';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Loading } from './pages/Loading';
import { General } from './pages/General';
import { ContextProvider } from '../Desktop/context';

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
        <Route path='/conversations' element={<ContextProvider><Chats /></ContextProvider>} />
        <Route path='/conversations/general' element={<ContextProvider><General/></ContextProvider>} />
        <Route path='/conversations/:slug' element={<ContextProvider><Chat /></ContextProvider>} />
        <Route path='/notfound' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

