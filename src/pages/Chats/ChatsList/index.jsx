import React from "react";
import { useNavigate, Link } from "react-router-dom";
import './ChatsList.css'


function ChatsList({ c }) {

    return (
        Object.keys(c).map((chat, i) => (
            <li
                className="chat-info"
                key={i}>
                <Link to={`/conversation/${chat}`}>
                    <span className="chat-info--photo"></span>
                    <h2 className="chat-info--user">{c[chat].name}</h2>
                    <p className="chat-info--message">{
                                            `${c[chat].direction === 'output' ? 'Tú: ' : ''}` +
                                            c[chat].text}</p>
                </Link>
            </li>
        ))
    );

}

export { ChatsList }

