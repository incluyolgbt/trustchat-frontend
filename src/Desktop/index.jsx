import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import React, { useState, useEffect } from 'react';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { Dashboard } from './Dashboard';

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
                <Route path='/conversations' element={<Dashboard />} />
                <Route path='/notfound' element={<NotFound />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
    )
}

export { Desktop };
