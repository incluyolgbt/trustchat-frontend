import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import './Home.css'

function Home() {
    const defaultMessage = ['necesito que me pases la información', 'como estás', 'hola' ];
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(defaultMessage);

    async function handlerSubmit(e) {
        e.preventDefault();
        setMessages([message, ...messages]);
        // try {
        //     await fetch('https://chat.danielmartine91.repl.co/api/v1/client', {
        //         method: 'POST', // or 'PUT'
        //         body: JSON.stringify({
        //             "to": number,
        //             "object": "whatsapp_business_account",
        //             "entry": [
        //                 {
        //                     "id": "116926351467394",
        //                     "changes": [
        //                         {
        //                             "value": {
        //                                 "messaging_product": "whatsapp",
        //                                 "metadata": {
        //                                     "display_phone_number": "15550758313",
        //                                     "phone_number_id": "114329885063727"
        //                                 },
        //                                 "contacts": [
        //                                     {
        //                                         "profile": {
        //                                             "name": "DanielMC"
        //                                         },
        //                                         "wa_id": "5213511507240"
        //                                     }
        //                                 ],
        //                                 "messages": [
        //                                     {
        //                                         "from": "",
        //                                         "id": "wamid.HBgNNTIxMzUxMTUwNzI0MBUCABIYFDNBRkZGM0QzNkVCNTI4Mzc0MDJBAA==",
        //                                         "timestamp": "1690302479",
        //                                         "text": {
        //                                             "body": message
        //                                         },
        //                                         "type": "text"
        //                                     }
        //                                 ]
        //                             },
        //                             "field": "messages"
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json; charset=utf-8'
        //         }
        //     });
        // } catch (error) {
        //     console.error(error);
        // }

    };

    useEffect(() => {
        //pendiente al webhook de supabase
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])

    return (
        <div className="main-container">
            <header>
                <span className="photo-username"></span>
                <span className="header-username">Daniel Martínez Cornejo</span>
                <button
                    className="header-button--logout"
                    onClick={() => supabase.auth.signOut()}>Logout</button>
            </header>
            <ul className="chat-container">
                {
                    messages.map((message, i) => (
                        <li
                            className="chat-container--message"
                            key={i}><p>{message}</p></li>
                    ))
                }
            </ul>
            <form
                className="type-message">
                <input
                    className="type-message-editor"
                    type='text' onChange={(e) => setMessage(e.target.value)} />
                <button
                    type="submit"
                    className="type-message--button"
                    onClick={handlerSubmit}>
                    Send
                </button>
            </form>
        </div>
    );
}

export { Home };