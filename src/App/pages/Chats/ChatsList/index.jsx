import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './ChatsList.css'
import { ProfilePhoto } from "../../../../Components/ProfilePhoto";


function ChatsList({ c }) {

    return (
        Object.keys(c).map((chat, i) => (
            <li
                className="chat-info"
                key={i}>
                <Link to={`/conversations/${chat}`}>
                    <ProfilePhoto name={c[chat].name} type={"chat-info--photo--chatList"} />
                    <h2 className="chat-info--user">{c[chat].name}</h2>
                    <p className="chat-info--message">{
                        `${c[chat].direction === 'output' ? 'Tú: ' : ''}` +
                        (c[chat].text.length < 80 ? c[chat].text : c[chat].text.substring(0, 80).concat('...'))
                    }</p>
                </Link>
            </li>
        ))
    );

}

export { ChatsList }

