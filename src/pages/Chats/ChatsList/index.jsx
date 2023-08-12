import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './ChatsList.css'
import { ProfilePhoto } from "../../../Components/ProfilePhoto";


function ChatsList({ c }) {

    return (
        Object.keys(c).map((chat, i) => (
            <li
                className="chat-info"
                key={i}>
                <Link to={`/conversation/${chat}`}>
                    <ProfilePhoto  name={c[chat].name} type={"chat-info--photo--chatList"}/>
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

