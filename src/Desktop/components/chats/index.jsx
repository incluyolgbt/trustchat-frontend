import React, { useState, useEffect, useContext } from 'react'
import { supabase } from '../../../supabase/client';
import { useNavigate, useLocation } from "react-router-dom";
import { PopUp } from '../../../modals/PopUp';
import { ConnectionLost } from '../../../Components/ConnectionLost';
import { useOnLine } from '../../../Hooks/useOnLine';
import { ChatsList } from './ChatsList'
import { v4 } from 'uuid';
import './Chats.css';
import { Context } from '../../context';

function Chats() {
    const { isOnline } = useOnLine();
    const { socket } = useContext(Context);
    const [chats, setChats] = useState([]);

    const location = useLocation();

    function chts(cht) {
        setChats((state) => [...state, cht]);
    }

    useEffect(() => {

        if (chats.length !== 0) {
            const algo = (msg) => {
                const newChats = [...chats] //sobreescribir chats con el nuevo mensaje
                newChats[0][msg.from] = { ...newChats[0][msg.from], text: msg.text, direction: 'input' }
                setChats(newChats);
            };

            socket.on('message', (msg) => algo(msg));
        }
    }, [chats])

    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            navigate(location.pathname);
        }
    }, [navigate])

    var chatTemps = {};
    useEffect(() => {
        try {
            supabase.from('messages') //consulto por todos los mensajes y guardo solo el último  
                .select(`
              *, 
              contacts (name
                  )
              `)
                .then(data => {
                    data.data.map((msg) => {
                        const temp = msg.contact_id;
                        chatTemps[temp] = {
                            name: msg.contacts.name,
                            text: (msg.content.body ? msg.content.body : msg.content),
                            direction: msg.direction
                        };
                    })
                    chts(chatTemps)
                })
        } catch (error) {
            console.error(error)
        }

    }, [])

    return (
        (isOnline ?
            <>
                <header className="desktop-chats-header--container">
                    <div className="desktop-chat-header--container--options">
                        <h1 className="desktop-chats">Chats</h1>
                        <button
                            className="desktop-header-button--logout"
                            onClick={() => supabase.auth.signOut()}>Log out</button>
                    </div>
                </header>

                <ul className="desktop-chats-container">
                    {
                        chats.map((c, i) => (
                            <ChatsList
                                key={v4()}
                                c={c} />
                        ))
                    }
                </ul>

            </>
            : null)

    );
}

export { Chats };
