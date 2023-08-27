import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import React, { useState, useEffect } from 'react';
import { Login } from '../Components/Login';
import { NotFound } from '../Components/NotFound';
import { Dashboard } from './Dashboard';
import { Welcome } from './components/Welcome';
import { General } from './components/General';
import { ContextProvider } from './context';
import { Chat } from './components/chat';

function Desktop() {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate('/login')
            }
        })
    }, [navigate])

    return (

        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/conversations' element={<Dashboard />}>
                <Route path='' element={<ContextProvider><Welcome /></ContextProvider>} />
                <Route path='general' element={<ContextProvider><General /></ContextProvider>} />
                <Route path=':slug' element={
                    <ContextProvider><Chat /></ContextProvider>
                } />
            </Route>
            <Route path='/notfound' element={<NotFound />} />
            <Route path='*' element={<NotFound />} />
        </Routes>

    )
}

export { Desktop };
