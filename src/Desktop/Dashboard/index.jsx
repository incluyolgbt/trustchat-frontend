import React, { useEffect, useState } from 'react'
import { Chats } from '../components/chats';
import { Chat } from '../components/chat';
import { supabase } from '../../supabase/client';
import './Dashboard.css'
import { ContextProvider } from '../context';
import { Outlet } from 'react-router-dom';

function Dashboard() {
    return (
        <ContextProvider>
            <main className='dashboard-main-container'>
                <section className='dashboard-chats'>
                    <Chats />
                </section>
                <section className='dashboard-chat'>
                    <Outlet/>
                </section>
            </main>
        </ContextProvider>

    )
}

export { Dashboard };
