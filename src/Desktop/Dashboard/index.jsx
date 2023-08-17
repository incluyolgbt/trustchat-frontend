import React, { useEffect, useState } from 'react'
import { Chats } from '../components/chats';
import { Chat } from '../components/chat';
import { supabase } from '../../supabase/client';
import './Dashboard.css'
import { ContextProvider } from '../context';

function Dashboard() {
    return (
        <ContextProvider>
            <main className='dashboard-main-container'>
                <section className='dashboard-chats'>
                    <Chats />
                </section>
                <section className='dashboard-chat'>
                    <Chat />
                </section>
            </main>
        </ContextProvider>

    )
}

export { Dashboard };
