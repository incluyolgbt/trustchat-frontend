import React from 'react'
import { Chats } from '../components/chats';
import { Chat } from '../components/chat';
import './Dashboard.css'

function Dashboard() {

    //colocar aquí el efecto de auth
    return (
        <main className='dashboard-main-container'> 
            <section className='dashboard-chats'>
                <Chats/>
            </section>
            <section className='dashboard-chat'>
               <Chat/>
            </section>

        </main>

    )
}

export { Dashboard };
