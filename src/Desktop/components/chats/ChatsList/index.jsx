import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import './ChatsList.css'
import { ProfilePhoto } from "../../../../Components/ProfilePhoto";
import { Chat } from '../../chat';
import { BrowserRouter } from "react-router-dom";
import { Context } from '../../../context'
import { v4 } from 'uuid';


function ChatsList({ c }) {
    const { setNum } = React.useContext(Context);

    const chatHandler = (num) => {
        setNum(num);
    }
    return (

        Object.keys(c).map((chat) => (
            <a
                key={chat}
                onClick={() => (chatHandler(chat))}
                // to={`/conversation/${chat}`}
                >

                <li

                    className="desktop-chat-info">
                    <ProfilePhoto name={c[chat].name} type={"desktop-chat-info--photo--chatList"} />
                    <h2 className="desktop-chat-info--user">{c[chat].name}</h2>
                    <p className="desktop-chat-info--message">{
                        `${c[chat].direction === 'output' ? 'Tú: ' : ''}` +
                        c[chat].text}</p>
                </li>
            </a>
        ))
    );

}

export { ChatsList }

